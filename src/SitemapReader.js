import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

export default class SitemapReader {
  constructor(sitemapUrl) {
    this.sitemapUrl = sitemapUrl;
  }

  static async readSitemap(url) {
    const sitemap = await axios.get(url);
    const sitemapJson = new XMLParser().parse(sitemap.data);

    return sitemapJson;
  }

  async *readDepthUrlStream() {
    const sitemapParentJson = await SitemapReader.readSitemap(this.sitemapUrl);

    const sitemapChilds = sitemapParentJson.sitemapindex.sitemap;

    for (const sitemap of sitemapChilds) {
      const sitemapUrl = sitemap.loc;
      const sitemapJson = await SitemapReader.readSitemap(sitemapUrl);

      const sitemapUrls = sitemapJson.urlset.url;

      for (const url of sitemapUrls) {
        yield url.loc;
      }
    }
  }
}
