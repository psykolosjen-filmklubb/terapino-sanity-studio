import React, { useState } from "react";
import { Movie, useTmdbSearch } from "../../swr/useTmdbSearch";
import {
  Box,
  TextInput,
  Spinner,
  Text,
  Stack,
  Flex,
  Grid,
  Button,
  Card,
} from "@sanity/ui";
import { ObjectInputProps, set } from "sanity";
import { SearchIcon } from "@sanity/icons";
import {
  fetchMovieDirectorsSingle,
  TmdbCrewMember,
} from "./fetchMovieDirectorsSingle";

export const TmdbSearchFieldSingle = (props: ObjectInputProps) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );

  const { movies, error, isLoading } = useTmdbSearch(searchTerm);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    setSearchTimeout(
      setTimeout(() => {
        setSearchTerm(e.target.value);
      }, 300),
    );
  };

  const handleChooseMovie = async (movie: Movie) => {
    const directors = await fetchMovieDirectorsSingle(movie.id);
    props.onChange(
      set({
        title: movie.title,
        tmdb_id: movie.id,
        release_year: Number(movie.release_date.substring(0, 4)),
        directors: getDirectorsString(directors),
      }),
    );
    setSearchTerm("");
  };

  return (
    <Box style={{ position: "relative", overflow: "visible" }}>
      <TextInput
        value={inputValue}
        onChange={handleSearchChange}
        placeholder="Søk etter film..."
        style={{ position: "relative" }}
        icon={SearchIcon}
      />
      <Card
        shadow={5}
        style={{ position: "absolute", width: "100%", zIndex: 100 }}
      >
        {isLoading && (
          <Box padding={3}>
            <Spinner muted />
          </Box>
        )}
        {error && (
          <Box padding={3}>
            <Text size={1}>Error: {error.message}</Text>
          </Box>
        )}
        {!isLoading && !error && movies?.length === 0 && (
          <Box padding={3}>
            <Text size={1} muted>
              No results found.
            </Text>
          </Box>
        )}
        {!isLoading && !error && movies?.length && (
          <Grid
            style={{
              overflowY: "auto",
              height: "40vh",
              marginLeft: "0.5rem",
              paddingTop: "0.5rem",
              paddingBottom: "0.5rem",
            }}
            gap={2}
          >
            {movies?.map((movie) => (
              <Button
                mode="ghost"
                key={movie.id}
                style={{
                  cursor: "pointer",
                }}
                onClick={() => {
                  handleChooseMovie(movie);
                }}
              >
                <Flex>
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    style={{ width: 80, height: 120, marginRight: 10 }}
                  />
                  <Stack space={3}>
                    <Text size={2} weight="bold" textOverflow="ellipsis">
                      {movie.title}
                    </Text>
                    <Text size={1}>{movie.release_date.substring(0, 4)}</Text>
                  </Stack>
                </Flex>
              </Button>
            ))}
          </Grid>
        )}
      </Card>
    </Box>
  );
};

function getDirectorsString(directors: TmdbCrewMember[]): string {
  return directors.map((director) => director.name).join(", ");
}
