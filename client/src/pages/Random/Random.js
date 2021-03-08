import axios from "axios";
import { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import { useSWRInfinite } from "swr";
import { AuthContext } from "../../context/AuthContext";
import MangaCard from "../../components/MangaCard/MangaCard";

const anilistFetch = async (ids, user) => {
  const query = `
  query ($ids: [Int]) { # Define which variables will be used in the query (id)
    Page(perPage: 50){
    media (id_in: $ids) { # Insert our variables into the query arguments (id) (type: ANIME is hard-coded in the query)
      id
      title {
        romaji
      }
      description
      coverImage{
        large
        medium
      }
      genres
    }
  }
  
  }
  `;
  try {
    const res = await axios.post(
      "https://graphql.anilist.co",
      {
        query: query,
        variables: {
          ids,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    return res.data.data.Page.media;
  } catch (error) {
    throw error;
  }
};

const listFetch = async (url, user) => {
  try {
    const { data } = await axios.get(url);
    const list = await anilistFetch(data.list, user);
    return list;
  } catch (error) {
    console.log(error.response.data.errors.message);
  }
};

export default function Random(props) {
  const [listID, setListID] = useState(props.match.params.id);
  const { user } = useContext(AuthContext);
  const getKey = (pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData.length) return null;
    return [
      `http://192.168.1.242:5000/api/random-lists/${listID}/${
        Number(pageIndex) + 1
      }`,
      user,
    ];
  };
  const { data, size, setSize } = useSWRInfinite(getKey, listFetch); //rmg api
  const list = data ? [].concat(...data) : [];
  useEffect(() => {}, []);
  if (!data) {
    return "loading";
  }

  return (
    <main className="mt-14 container max-w-7xl mx-auto">
      <div className="px-2 py-5 text-left">
        <h1 className="text-white font-semibold text-3xl">Random list</h1>
        <p className="text-xs text-gray-600">ID: {props.match.params.id}</p>
      </div>
      <section className="px-2 py-20 container max-w-7xl grid grid-cols-1  md:grid-cols-2 xl:grid-cols-3 auto-cols-fr gap-x-4 gap-y-6 mx-auto">
        {list.map((manga) => {
          const { title, description, coverImage, genres } = manga;
          return (
            <MangaCard
              title={title.romaji}
              description={description}
              cover={coverImage.large}
              genres={genres}
              key={title}
            />
          );
        })}
      </section>
      <button onClick={() => setSize(size + 1)}>Load more</button>
    </main>
  );
}
