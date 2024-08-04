import { useEffect, useState } from "react";
import { fetchAuthorLinks, fetchTop10Lists } from "../src/lib/scraper";
import { aggregateTop10Lists, getMostFrequentSong } from "../src/lib/aggregate";
import styles from "../styles/Home.module.css";

const Loader = () => (
  <div className={styles.loader}>
    <div className={styles.loaderInner}>
      <div className={styles.loaderLineWrap}>
        <div className={styles.loaderLine}></div>
      </div>
      <div className={styles.loaderLineWrap}>
        <div className={styles.loaderLine}></div>
      </div>
      <div className={styles.loaderLineWrap}>
        <div className={styles.loaderLine}></div>
      </div>
      <div className={styles.loaderLineWrap}>
        <div className={styles.loaderLine}></div>
      </div>
      <div className={styles.loaderLineWrap}>
        <div className={styles.loaderLine}></div>
      </div>
    </div>
  </div>
);

export default function Home() {
  const [topSongs, setTopSongs] = useState([]);
  const [authorLinks, setAuthorLinks] = useState([]);
  const [mostFrequentSong, setMostFrequentSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authorTop10s, setAuthorTop10s] = useState({});

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const authorLinks = await fetchAuthorLinks();
      setAuthorLinks(authorLinks);

      const lists = await fetchTop10Lists(authorLinks);
      console.log("Fetched lists:", lists); // Debugging-Ausgabe

      const aggregated = aggregateTop10Lists(lists);
      setTopSongs(aggregated);
      console.log("Aggregated Top Songs:", aggregated); // Debugging-Ausgabe

      const mostFrequent = getMostFrequentSong(lists);
      setMostFrequentSong(mostFrequent);
      console.log("Most Frequent Song:", mostFrequent); // Debugging-Ausgabe

      // Create a map of author names to their top 10 lists
      const authorTop10Map = {};
      lists.forEach((list) => {
        authorTop10Map[list.author] = list.top10;
      });
      setAuthorTop10s(authorTop10Map);

      setLoading(false);
    };

    getData();
  }, []);

  const renderTopSongs = (songs) => {
    let rank = 0;
    let previousPoints = null;
    let skippedRanks = 0;

    return songs.map(([song, points], index) => {
      if (points !== previousPoints) {
        rank += 1 + skippedRanks;
        skippedRanks = 0;
      } else {
        skippedRanks += 1;
      }
      previousPoints = points;

      return (
        <li
          key={index}
          className={
            rank === 1 ? styles.songItem + " " + styles.first : styles.songItem
          }
        >
          {rank}. {song} - {points} points
        </li>
      );
    });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Gewinner</h2>
      <h3 className={styles.header}>Radioeins Sommersonntag</h3>

      {loading ? (
        <Loader />
      ) : mostFrequentSong ? (
        <div className={styles.frequentSong}>
          <p>
            <strong>{mostFrequentSong[0]}</strong> - {mostFrequentSong[1]}{" "}
            mentions
          </p>
        </div>
      ) : (
        <p>No data available</p>
      )}

      <img
        src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmRxcnA5NDBxcmUydnRnbDYwOHgxdHRua3hjMTczOW9odzR5bjcyMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/WntXPfD9DB1rD45Nif/giphy.webp"
        alt="Summer Fun"
        className={styles.summerGif}
      />

      <h1 className={styles.header}>Top 100 Songs</h1>
      {loading ? (
        <Loader />
      ) : (
        <ul className={styles.songList}>
          {topSongs.length > 0 ? (
            renderTopSongs(topSongs)
          ) : (
            <li>No data available</li>
          )}
        </ul>
      )}

      <img
        src="https://i.gifer.com/4j.gif"
        alt="Summer Beach"
        className={styles.summerGif}
      />

      <h2 className={styles.header}>Autoren</h2>
      {loading ? (
        <Loader />
      ) : (
        <ul className={styles.authorList}>
          {Object.entries(authorTop10s).map(([author, top10], index) => (
            <li key={index} className={styles.authorItem}>
              <h3>{author}</h3>
              <ol>
                {top10.map((entry, idx) => (
                  <li key={idx}>
                    {entry.rank}. {entry.artist} - {entry.song}
                  </li>
                ))}
              </ol>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
