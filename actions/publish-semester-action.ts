import { useDocumentOperation, type DocumentActionComponent } from "sanity";
import { semesterName } from "../utils/semester";

export function createPublishSemesterAction(
  originalPublishAction: DocumentActionComponent,
): DocumentActionComponent {
  const PublishSemester: DocumentActionComponent = (props) => {
    const { patch } = useDocumentOperation(props.id, props.type);
    const original = originalPublishAction(props);
    if (!original) return original;

    return {
      ...original,
      onHandle: () => {
        // The name is derived so it always matches the year and season.
        const year = props.draft?.semester_year;
        const season = props.draft?.semester_season;
        if (
          typeof year === "number" &&
          (season === "spring" || season === "fall")
        ) {
          const name = semesterName(year, season);
          if (props.draft?.semester_name !== name)
            // Publish commits the local draft, including this queued patch.
            patch.execute([{ set: { semester_name: name } }]);
        }
        original.onHandle?.();
      },
    };
  };
  PublishSemester.action = originalPublishAction.action;
  return PublishSemester;
}
