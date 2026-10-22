import { Card, Stack, Text } from "@sanity/ui";
import { useClient } from "sanity";
import { IntentLink } from "sanity/router";
import useSWR from "swr";

type Screening = {
  _id: string;
  date?: string;
  movies?: { title?: string }[];
};

/** Document view listing the screenings that reference this program. */
export function SemesterScreeningsView({ documentId }: { documentId: string }) {
  const client = useClient({ apiVersion: "2024-01-16" });
  const { data, error } = useSWR(["semester-screenings", documentId], () =>
    client.fetch<Screening[]>(
      `*[_type == "screening" && references($id)] | order(date desc){
        _id, date, movies[]{title}
      }`,
      { id: documentId },
      // Editors need to see their planned screenings, not just published ones.
      { perspective: "drafts" },
    ),
  );

  return (
    <Stack space={3} padding={4}>
      <Text size={1} muted>
        Listen inkluderer utkast. Endre semester eller programmer på den enkelte
        visningen.
      </Text>
      {error ? (
        <Text size={1}>Kunne ikke hente visninger.</Text>
      ) : !data ? (
        <Text size={1}>Henter visninger…</Text>
      ) : data.length === 0 ? (
        <Text size={1} muted>
          Ingen visninger ennå.
        </Text>
      ) : (
        data.map((screening) => (
          <Card key={screening._id} padding={3} border radius={2}>
            <Stack space={2}>
              <IntentLink
                intent="edit"
                params={{ id: screening._id, type: "screening" }}
              >
                {screening.movies
                  ?.map((movie) => movie.title)
                  .filter(Boolean)
                  .join(" & ") || "Uten filmtittel"}
              </IntentLink>
              <Text size={1} muted>
                {screening.date || "Uten dato"}
              </Text>
            </Stack>
          </Card>
        ))
      )}
    </Stack>
  );
}
