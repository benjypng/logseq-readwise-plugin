export const bookView = () => {
  logseq.App.onMacroRendererSlotted(async ({ slot, payload }) => {
    const uuid = payload.uuid;
    const [type] = payload.arguments;
    if (!type.startsWith(':bookRenderer_')) return;

    const id = type.split('_')[1]?.trim();
    const bookRendererId = `bookRenderer_${id}`;

    // Get list of books using query
    let bookPropertyList = await logseq.DB.datascriptQuery(`[:find (pull ?p [*])
      :where
      [?p :block/name _]
      [?p :block/properties ?pr]
      [(get ?pr :category) ?comp]
      [(contains?  #{"[[books]]"} ?comp)]
    ]`);

    bookPropertyList = bookPropertyList.map((i: any) => ({
      originalName: i[0]['original-name'],
      properties: i[0]['properties'],
      pageUUID: i[0]['uuid']['$uuid$'],
      pageName: i[0]['name'],
    }));

    for (const b of bookPropertyList) {
      const pbt = await logseq.Editor.getPageBlocksTree(b.pageName);
      const imageUrl = pbt[1].content;

      const regExp = /\((.*?)\)/;
      const matched = regExp.exec(imageUrl);

      b['imageUrl'] = matched[1];
    }

    // Function to go to Block
    const goTo = async (x: string) => {
      logseq.App.pushState('page', { name: x });
    };

    // Create model for each section so as to enable events
    let models = {};
    for (let m = 0; m < bookPropertyList.length; m++) {
      models['goToPage' + m] = function () {
        goTo(bookPropertyList[m].pageName);
      };
    }
    logseq.provideModel(models);

    let html: string = '';
    for (let i = 0; i < bookPropertyList.length; i++) {
      const { author, category, source } = bookPropertyList[i].properties;

      html += `<div class="card" data-on-click="goToPage${i}">
                    <div class="image" style="background-image: url('${
                      bookPropertyList[i].imageUrl
                    }')">              
                    <p class="source">${source.substring(
                      2,
                      source.length - 2
                    )}</p>
                    </div>
                    <div class="desc">
                      <p class="originalName">${
                        bookPropertyList[i].originalName
                      }</h5>
                      <p class="author">${author}</p>
                    </div>
                   </div>`;
    }

    const bookBoard = (board: string) => {
      return `<div id="${bookRendererId}" data-slot-id="${slot}" data-bookRenderer-id="${bookRendererId}" data-block-uuid="${uuid}" class="container">${board}</div>`;
    };

    logseq.provideStyle(`
          .container {
            display: flex;
            justify-content: center;
            padding: 10px 0;
            flex-direction: row;
            flex-wrap: wrap;
            gap: 40px;
            background-color: #eee;
          }
    
          .card {
            display: flex;
            align-items: top;
            flex-direction: column;
            max-width: 200px;
            box-sizing: border-box;
            border-radius: 8px;
            background-color: #fff;
            box-shadow: -5px 5px 10px #aaaaaa;
          }
    
          .card:hover {
            box-shadow: -5px 10px 15px #aaaaaa;
            transform: translateY(-8px);
            transition: all 0.1s;
          }
    
          .card:hover {
            cursor: pointer;
          }
    
          .image {
            height: 250px;
            width: 200px;
            background-repeat: no-repeat;
            background-size: 100% 100%;
    
            display: flex;
            justify-content: right;
            align-items: top;
          }
          
          .desc {
            word-wrap: break-word;
            display: flex;
            flex-direction: column;
            align-items: top;
            justify-content: left;
            padding: 3px 5px;
          }
    
          .source {
            margin: 0;
            padding: 0 0 0 4px;
            background-color: navy;
            height: 23px;
            color: white;
            border-radius: 0 0 0 12px;
            font-size: 70%;
          }
    
          .originalName {
            font-weight: 700;
          }
    
          .author {
            font-size: 80%;
          }
        `);

    logseq.provideUI({
      key: `${bookRendererId}`,
      slot,
      reset: true,
      template: bookBoard(html),
    });
  });
};
