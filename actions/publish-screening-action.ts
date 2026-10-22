import { useRef, useState } from "react";
import {
  getDraftId,
  useClient,
  useDocumentOperation,
  useSyncState,
  useValidationStatus,
  type DocumentActionComponent,
} from "sanity";
import { useToast } from "@sanity/ui/toast";
import { mutate } from "swr";
import { ensureSemester, SEMESTERS_SWR_KEY } from "../utils/semester";

export function createPublishScreeningAction(
  originalPublishAction: DocumentActionComponent,
): DocumentActionComponent {
  const PublishScreening: DocumentActionComponent = (props) => {
    const client = useClient({ apiVersion: "2024-01-16" }).withConfig({
      // Publishing needs fresh data so an existing semester is not overlooked.
      useCdn: false,
    });
    const toast = useToast();
    const original = originalPublishAction(props);
    const { patch } = useDocumentOperation(props.id, props.type);
    const sync = useSyncState(props.id, props.type);
    // Validate the draft: a published ID validates the published document,
    // whose revision never matches the draft's.
    const validation = useValidationStatus(
      getDraftId(props.id),
      props.type,
      true,
    );
    // Treat a missing value as automatic, the default, so a screening is never
    // silently left without a semester.
    const auto = props.draft?.auto_semester !== false;
    // Do not enter Sanity's deferred publish queue in automatic mode: that
    // queue could publish a later date without setting its semester.
    const ready =
      !sync.isSyncing &&
      !validation.isValidating &&
      validation.revision === props.draft?._rev;
    const [creating, setCreating] = useState(false);
    const busy = useRef(false);
    // The semester request is asynchronous; check the latest draft before
    // publishing so edits made during the request cannot use a stale semester.
    const latest = useRef({ props, original, ready });
    latest.current = { props, original, ready };
    if (!original) return original;

    return {
      ...original,
      disabled: original.disabled || creating || (auto && !ready),
      title:
        auto && !ready ? "Venter på lagring og validering…" : original.title,
      label: creating ? "Finner semester…" : original.label,
      onHandle: async () => {
        if (busy.current || original.disabled) return;
        const draft = props.draft;
        if (!draft || !auto) {
          original.onHandle?.();
          return;
        }
        if (!ready) return;
        busy.current = true;
        setCreating(true);
        try {
          const semesterId = await ensureSemester(client, draft.date);
          void mutate(SEMESTERS_SWR_KEY);
          const current = latest.current;
          if (
            current.props.draft?._rev !== draft._rev ||
            current.props.draft?.date !== draft.date ||
            current.props.draft?.auto_semester !== draft.auto_semester
          ) {
            throw new Error(
              "Visningen ble endret under publisering. Publiser på nytt.",
            );
          }
          if (!current.ready || current.original?.disabled) {
            throw new Error(
              "Visningen er ikke klar til publisering. Kontroller feltene og prøv igjen.",
            );
          }
          const semester = draft.semester as { _ref?: string } | undefined;
          if (semester?._ref !== semesterId) {
            // Publish commits the local draft, including this queued patch.
            patch.execute([
              { set: { semester: { _type: "reference", _ref: semesterId } } },
            ]);
          }
          current.original?.onHandle?.();
        } catch (error) {
          toast.push({
            status: "error",
            title: "Kunne ikke publisere visningen",
            description: error instanceof Error ? error.message : "Prøv igjen.",
          });
          props.onComplete();
        } finally {
          busy.current = false;
          setCreating(false);
        }
      },
    };
  };
  PublishScreening.action = originalPublishAction.action;
  return PublishScreening;
}
