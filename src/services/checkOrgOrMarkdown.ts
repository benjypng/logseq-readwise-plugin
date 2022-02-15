import { getDateForPage } from 'logseq-dateutils';

const prepareTags = (t: any[]) => {
  const tagArr = t.map((t) => `[[${t.name}]]`);
  return tagArr.join(', ');
};

export const returnKindleHighlights = (
  orgOrMarkdown: string,
  location: string,
  asin: string,
  highlighted_at: string,
  preferredDateFormat: string,
  tags: any[],
  text: string
) => {
  if (orgOrMarkdown === 'markdown') {
    return {
      content: `location:: [${location}](kindle://book?action=open&asin=${asin}&location=${location})
  on:: ${getDateForPage(new Date(highlighted_at), preferredDateFormat)}
  tags:: ${prepareTags(tags)}
  ${text}`,
    };
  } else if (orgOrMarkdown === 'org') {
    return {
      content: `${text}
      :PROPERTIES:
      :location: [[kindle://book?action=open&asin=${asin}&location=${location}][${location}]]
      :on: ${getDateForPage(new Date(highlighted_at), preferredDateFormat)}
      :tags: ${prepareTags(tags)} 
      :END:`,
    };
  }
};

export const returnOtherHighlights = (
  orgOrMarkdown: string,
  url: string,
  highlighted_at: string,
  preferredDateFormat: string,
  tags: any[],
  text: string
) => {
  if (orgOrMarkdown === 'markdown') {
    return {
      content: `link:: [${url}](${url})
  on:: ${getDateForPage(new Date(highlighted_at), preferredDateFormat)}
  tags:: ${prepareTags(tags)}
  ${text}`,
    };
  } else if (orgOrMarkdown === 'org') {
    return {
  content: `${text}
  :PROPERTIES:
:link: ${url}
:on: ${getDateForPage(new Date(highlighted_at), preferredDateFormat)}
:tags: ${prepareTags(tags)} 
:END:`,
    };
  }
};

export const returnPageMetaData = (
  orgOrMarkdown: string,
  preferredDateFormat: string,
  author: string,
  category: string,
  source: string,
  tags: any[],
  metaData: string
) => {
  if (orgOrMarkdown === 'markdown') {
    return `retrieved:: ${getDateForPage(new Date(), preferredDateFormat)}
  author:: [[${author}]]
  category:: [[${category}]]
  source:: [[${source}]]
  tags:: ${prepareTags(tags)}
  ${metaData}`;
  } else if (orgOrMarkdown === 'org') {
    if(metaData === ''){
      return `:PROPERTIES:
      :retrieved: ${getDateForPage(new Date(), preferredDateFormat)}
      :author: [[${author}]]
      :category: [[${category}]]
      :source: [[${source}]]
      :tags: ${prepareTags(tags)}
      :END:`;
    }else{
    return `:PROPERTIES:
:retrieved: ${getDateForPage(new Date(), preferredDateFormat)}
:author: [[${author}]]
:category: [[${category}]]
:source: [[${source}]]
:tags: ${prepareTags(tags)}
${metadata}
:END:`;
    }
  }
};

export const returnImage = (
  orgOrMarkdown: string,
  cover_image_url: string,
  height: string,
  width: string
) => {
  if (orgOrMarkdown === 'markdown') {
    return `![book_image](${cover_image_url}){:height ${height} :width ${width}}`;
  } else if (orgOrMarkdown === 'org') {
    return `[[${cover_image_url}][${cover_image_url}]]`;
  }
};
