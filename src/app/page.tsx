import HomeClient from "./HomeClient";

type Movie = {
  _id: string;
  title: string;
  thumbnail: string;
  backdrop?: string;
  slug: string;
  duration?: number;
  description?: string;
};

type Collection = {
  _id: string;
  name: string;
  slug: string;
  movies: Movie[];
  is_active: boolean;
};

async function getCollections(): Promise<Collection[]> {
  const res = await fetch("http://localhost:3000/api/collections", {
    cache: "no-store",
  });

  const data = await res.json();
  return data.data || [];
}

export default async function Home() {
  const collections = await getCollections();

  return <HomeClient collections={collections} />;
}
