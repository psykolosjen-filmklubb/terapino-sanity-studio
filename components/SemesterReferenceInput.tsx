import { Card, Stack, Text } from "@sanity/ui";
import {
  useClient,
  useFormValue,
  type FieldProps,
  type ReferenceInputProps,
} from "sanity";
import useSWR from "swr";
import {
  findPublishedSemester,
  semesterForDate,
  SEMESTERS_QUERY,
  SEMESTERS_SWR_KEY,
  type SemesterDocument,
} from "../utils/semester";

/**
 * In automatic mode, shows which semester the publish action will set instead
 * of the reference picker. With automatic mode off, shows the picker.
 */
export function SemesterReferenceInput(props: ReferenceInputProps) {
  const auto = useFormValue(["auto_semester"]) !== false;
  const date = useFormValue(["date"]);
  const client = useClient({ apiVersion: "2024-01-16" });
  const { data, error } = useSWR(auto ? SEMESTERS_SWR_KEY : null, () =>
    client.fetch<SemesterDocument[]>(
      SEMESTERS_QUERY,
      {},
      // Include drafts to explain conflicts before the user tries to publish.
      { perspective: "raw" },
    ),
  );

  let message: string | null = null;
  let problem = false;
  const semester = semesterForDate(date);
  if (!auto) {
    if (!props.value?._ref)
      message = "Visningen inngår ikke i noe semester i arkivet.";
  } else if (!semester) message = "Velg en visningsdato for å se semesteret.";
  else if (error) {
    problem = true;
    message =
      "Kunne ikke hente semesterprogrammer. Prøv igjen før publisering.";
  } else if (!data) message = "Henter semesterprogrammer…";
  else {
    try {
      const existing = findPublishedSemester(data, semester);
      message = !existing
        ? `${semester.name} opprettes og settes når du publiserer.`
        : existing._id === props.value?._ref
          ? `Inngår i ${semester.name}, basert på visningsdatoen.`
          : `Settes til ${semester.name} når du publiserer.`;
    } catch (error) {
      problem = true;
      message =
        error instanceof Error ? error.message : "Kunne ikke finne semesteret.";
    }
  }

  return (
    <Stack space={3}>
      {message && (
        <Card padding={3} radius={2} tone={problem ? "critical" : "primary"}>
          <Text size={1}>{message}</Text>
        </Card>
      )}
      {/* The picker is only for the rare manual choice; in automatic mode the
          message above already names the semester. */}
      {!auto && props.renderDefault(props)}
    </Stack>
  );
}

/** Renders a field's input without its title, for fields inside a titled fieldset. */
export function UntitledField(props: FieldProps) {
  return props.children;
}
