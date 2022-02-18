import React, { useState } from 'react';

const Customise = () => {
  const [template, setTemplate] = useState({
    customTitle: logseq.settings.template?.customTitle,
    metaData: logseq.settings.template?.metaData,
    height: logseq.settings.template?.height,
    width: logseq.settings.template?.width,
    sectionHeader: logseq.settings.template?.sectionHeader,
  });

  const [hiding, setHiding] = useState(logseq.settings.hiding);

  const toggleHiding = () => {
    if (hiding) {
      setHiding(false);
      logseq.updateSettings({ hiding: false });
    } else if (!hiding) {
      setHiding(true);
      logseq.updateSettings({ hiding: true });
    }
  };

  const handleInput = (e: any) => {
    setTemplate((currTemplate) => ({
      ...currTemplate,
      [e.target.name]: e.target.value,
    }));
  };

  const { customTitle, metaData, height, width, sectionHeader } = template;

  const submitTemplate = () => {
    if (customTitle === '' || sectionHeader === '') {
      logseq.App.showMsg(
        'Please ensure all customisation fields are completed!',
        'error'
      );
      return;
    }
    logseq.updateSettings({ template: template });
    logseq.App.showMsg('Customisation saved!');
  };

  return (
    <div className="flex flex-col py-2 bg-white">
      <div className="flex flex-row justify-between">
        <p className="text-2xl font-bold mb-3">Step 2: Start Customising </p>
        {!hiding && (
          <p
            onClick={toggleHiding}
            className="text-blue-500 font-bold pl-3 cursor-pointer"
          >
            hide
          </p>
        )}
        {hiding && (
          <p
            onClick={toggleHiding}
            className="text-blue-500 font-bold pl-3 cursor-pointer"
          >
            show
          </p>
        )}
      </div>

      {!hiding && (
        <React.Fragment>
          {/* TITLE */}
          <div className="mb-5">
            <p className="text-lg font-semibold">Title</p>
            <p>
              Use %title% (e.g. To Kill a Mockingbird), %category% (e.g. books),
              %source% (e.g. kindle) or %author% (e.g. Harper Lee) to indicate
              the title, category, source or author in the name of the
              highlights page and add your preferred prefixes or suffixes.
            </p>
            <input
              placeholder="%category%/%title% (Readwise)"
              type="text"
              name="customTitle"
              value={customTitle}
              onChange={handleInput}
              className="border border-gray-200 hover:border-blue-500 w-full px-3 py-1 focus:border-blue-500 focus:border-b-4"
              required
            />
          </div>

          {/* PAGE PROPERTIES */}
          <div className="mb-5">
            <p className="text-lg font-semibold">Additional Metadata</p>
            <p>
              In addition to the core properties (retrieved date, author,
              category, source, tags), you can indicate other meta properties
              that will go to the top of the page. Acceps both markdown and
              org-mode formats. For org, use the format :key: value to define
              the metadata.
            </p>
            <input
              placeholder="referrer:: [[Readwise]]"
              type="text"
              name="metaData"
              value={metaData}
              onChange={handleInput}
              className="border border-gray-200 hover:border-blue-500 w-full px-3 py-1 focus:border-blue-500 focus:border-b-4"
            />
          </div>

          {/* IMAGE SIZE */}
          <div className="mb-5">
            <p className="text-lg font-semibold">Image Size</p>
            <p>Set the height and width of the book/source image in pixels.</p>
            <div className="flex flex-row justify-between content-center">
              <span className="inline-block align-middle pt-2">Height: </span>
              <input
                placeholder="200"
                type="text"
                name="height"
                value={height}
                onChange={handleInput}
                className="border border-gray-200 hover:border-blue-500 w-2/6 px-3 py-1 focus:border-blue-500 focus:border-b-4"
              />
              <span className="inline-block align-middle pt-2">Width: </span>
              <input
                placeholder="200"
                type="text"
                name="width"
                value={width}
                onChange={handleInput}
                className="border border-gray-200 hover:border-blue-500 w-2/6 px-3 py-1 focus:border-blue-500 focus:border-b-4"
              />
            </div>
          </div>

          {/* READWISE HIGHLIGHTS TITLE */}
          <div className="mb-5">
            <p className="text-lg font-semibold">Title of Highlights Section</p>
            <p>
              Set the title of the highlights section. Accepts both markdown and
              org-mode formats. Note: In order to use the Random Highlights
              function, please surround your title with '[[ ]]'.
            </p>
            <input
              placeholder="## [[Readwise Highlights]]"
              type="text"
              name="sectionHeader"
              value={sectionHeader}
              onChange={handleInput}
              className="border border-gray-200 hover:border-blue-500 w-full px-3 py-1 focus:border-blue-500 focus:border-b-4"
              required
            />
          </div>

          <div className="mb-5">
            <button
              className="border bg-blue-500 text-white px-2 py-1 rounded"
              onClick={submitTemplate}
            >
              Save Customisation
            </button>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default Customise;
