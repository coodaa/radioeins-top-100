export const aggregateTop10Lists = (lists) => {
  let aggregated = {};

  lists.forEach((list) => {
    list.top10.forEach((entry) => {
      const { rank, artist, song } = entry;
      if (artist && song && !isNaN(rank)) {
        const key = `${artist} - ${song}`;
        if (!aggregated[key]) {
          aggregated[key] = 0;
        }
        aggregated[key] += 11 - rank; // 10 Punkte für Platz 1, 9 für Platz 2, usw.
      } else {
        console.warn('Invalid entry in aggregation:', { rank, artist, song });
      }
    });
  });

  console.log('Aggregated list:', aggregated); // Debugging-Ausgabe
  return Object.entries(aggregated).sort((a, b) => b[1] - a[1]);
};

export const getMostFrequentSong = (lists) => {
  let frequency = {};

  lists.forEach((list) => {
    list.top10.forEach((entry) => {
      const { artist, song } = entry;
      if (artist && song) {
        const key = `${artist} - ${song}`;
        if (!frequency[key]) {
          frequency[key] = 0;
        }
        frequency[key] += 1;
      } else {
        console.warn('Invalid entry in frequency calculation:', { artist, song });
      }
    });
  });

  const sortedFrequency = Object.entries(frequency).sort((a, b) => b[1] - a[1]);
  console.log('Sorted frequency:', sortedFrequency); // Debugging-Ausgabe
  return sortedFrequency.length > 0 ? sortedFrequency[0] : null;
};
