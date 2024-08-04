import { useEffect, useState } from 'react';
import { fetchAuthorLinks, fetchTop10Lists } from '../src/lib/scraper';
import { aggregateTop10Lists, getMostFrequentSong } from '../src/lib/aggregate';
import styles from '../styles/Home.module.css';

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

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const authorLinks = await fetchAuthorLinks();
      setAuthorLinks(authorLinks);

      const lists = await fetchTop10Lists(authorLinks);
      console.log('Fetched lists:', lists); // Debugging-Ausgabe

      const aggregated = aggregateTop10Lists(lists);
      setTopSongs(aggregated);
      console.log('Aggregated Top Songs:', aggregated); // Debugging-Ausgabe

      const mostFrequent = getMostFrequentSong(lists);
      setMostFrequentSong(mostFrequent);
      console.log('Most Frequent Song:', mostFrequent); // Debugging-Ausgabe

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
        <li key={index} className={rank === 1 ? styles.songItem + ' ' + styles.first : styles.songItem}>
          {rank}. {song} - {points} points
        </li>
      );
    });
  };

  return (
    <div className={styles.container}>
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

      <h2 className={styles.header}>Most Frequent Song</h2>
      {loading ? (
        <Loader />
      ) : mostFrequentSong ? (
        <div className={styles.frequentSong}>
          <p>
            <strong>{mostFrequentSong[0]}</strong> - {mostFrequentSong[1]} mentions
          </p>
        </div>
      ) : (
        <p>No data available</p>
      )}

      <h2 className={styles.header}>Authors</h2>
      {loading ? (
        <Loader />
      ) : (
        <ul className={styles.authorList}>
          {authorLinks.map((link, index) => (
            <li key={index} className={styles.authorItem}>
              <a href={link} target="_blank" rel="noopener noreferrer" className={styles.link}>
                {link}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
