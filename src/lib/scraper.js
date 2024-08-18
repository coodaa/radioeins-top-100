import axios from "axios";
import cheerio from "cheerio";

const baseURL =
  "https://www.radioeins.de/musik/top_100/2024/if-i-had-a-hammer/";

export const fetchAuthorLinks = async () => {
  try {
    const response = await axios.get(baseURL);
    const $ = cheerio.load(response.data);

    let authorLinks = [];
    $("article h3 a").each((i, element) => {
      const href = $(element).attr("href");
      if (href && href.includes("/musik/top_100/2024/if-i-had-a-hammer/")) {
        authorLinks.push(`https://www.radioeins.de${href}`);
      }
    });

    console.log("Author Links:", authorLinks); // Debugging-Ausgabe
    return authorLinks;
  } catch (error) {
    console.error("Error fetching author links:", error);
    return [];
  }
};

export const fetchTop10Lists = async (authorLinks) => {
  let allLists = [];

  for (let link of authorLinks) {
    try {
      const response = await axios.get(link);
      const $ = cheerio.load(response.data);

      let top10 = [];
      $("table tr").each((i, element) => {
        const rank = $(element).find("td").eq(0).text().trim();
        const artist = $(element).find("td").eq(1).text().trim();
        const song = $(element).find("td").eq(2).text().trim();
        if (rank && artist && song && !isNaN(rank)) {
          top10.push({ rank: parseInt(rank), artist, song });
        } else {
          console.warn("Invalid entry found:", { rank, artist, song });
        }
      });

      const author = link.split("/").pop().replace(".html", "");
      allLists.push({ author, top10 });

      console.log(`Fetched top 10 for ${author}:`, top10); // Debugging-Ausgabe
    } catch (error) {
      console.error(`Error fetching top 10 for ${link}:`, error);
    }
  }

  console.log("All lists:", allLists); // Debugging-Ausgabe
  return allLists;
};
