import { useDocumentOperation, type DocumentActionComponent } from "sanity";

export function createPublishMemberAction(
  originalPublishAction: DocumentActionComponent,
): DocumentActionComponent {
  const PublishMember: DocumentActionComponent = (props) => {
    const { patch } = useDocumentOperation(props.id, props.type);
    const original = originalPublishAction(props);
    if (!original) return original;

    return {
      ...original,
      onHandle: () => {
        // memberships is a required field, so validation blocks publishing without it.
        const memberships = props.draft?.memberships as Membership[];
        if (isActiveMember(memberships)) {
          patch.execute([
            {
              set: {
                is_active: true,
                last_membership_date: getMostRecentFromDate(memberships),
              },
            },
          ]);
        } else {
          patch.execute([
            {
              set: {
                is_active: false,
                last_membership_date: getLeftDate(memberships),
              },
            },
          ]);
        }

        original.onHandle?.();
      },
    };
  };
  PublishMember.action = originalPublishAction.action;
  return PublishMember;
}

function isActiveMember(memberships: Membership[]): boolean {
  return memberships.some((membership: Membership) => {
    const toDate = membership.to_date ? new Date(membership.to_date) : null;
    const today = new Date();
    return !toDate || toDate >= today;
  });
}

function getMostRecentFromDate(memberships: Membership[]): string {
  // Sort a copy so the draft's memberships array is not reordered in place.
  const mostRecentMembership = [...memberships].sort(
    (a: Membership, b: Membership) =>
      new Date(b.from_date).getTime() - new Date(a.from_date).getTime(),
  )[0];

  const mostRecentDate = mostRecentMembership
    ? mostRecentMembership.from_date
    : new Date().toISOString().split("T")[0]; // Fallback to today if no memberships found

  return mostRecentDate;
}

function getLeftDate(memberships: Membership[]): string {
  const leftMembership = memberships
    .filter((membership: Membership) => membership.to_date)
    .sort(
      (a: Membership, b: Membership) =>
        // Using ! to assert that to_date is not undefined here, after filtering
        new Date(b.to_date!).getTime() - new Date(a.to_date!).getTime(),
    )[0];

  const leftDate = leftMembership
    ? leftMembership.to_date!
    : new Date().toISOString().split("T")[0]; // Fallback to today if no memberships found
  return leftDate;
}

type Membership = {
  from_date: string;
  to_date?: string;
};
