import * as utils from "./utils.js";

export default function ({ data = [], t }) {
  return (
    <div className="report-wrapper">
      {data.map((obj) => (
        <div className="report-container">
          <header>
            <h1>Hello, {text(obj.name)}!</h1>
          </header>
          <main>
            <section>
              <header>{t("/@word/items")}</header>
              <div className="content">
                <table>
                  <thead>
                    <tr>
                      <th>Campo</th>
                      <th>{t("/@word/value")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {obj.items?.map((item, index) => (
                      <tr key={index}>
                        <td>Item {index + 1}</td>
                        <td>{utils.formatNumber(item)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td>{t("/@word/total")}</td>
                      <td>{utils.formatNumber(obj.items?.reduce((sum, item) => sum + item, 0))}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </section>
          </main>
        </div>
      ))}
    </div>
  );
};

function text(value) {
  return <strong>{value?.toUpperCase()}</strong>;
}