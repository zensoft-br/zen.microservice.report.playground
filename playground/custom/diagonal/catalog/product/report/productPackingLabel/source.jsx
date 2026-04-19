// import * as utils from "./utils.jsx";

export default function ({ data = [], t }) {
  const x = 5 - (data.length % 5);
  if (x !== 5) {
    for (let i = 0; i < x; i++) {
      data.push(data[data.length - 1]);
    }
  }

  return (
    <div className="report-wrapper">
      {new Array(Math.ceil(data.length / 5)).fill({}).map((obj, index) => (
        <div className="report-container">
          <main className="flex v">
            <div className="content flex h flex-1">
              {data.slice(index * 5, index * 5 + 5).map((obj) => (
                <div className="flex v" style={{ flex: "3" }}>
                  <dl className="flex-1 rotate" style={{ alignItems: "center" }}>
                    <dt>{obj.code}</dt>
                    <dd style={{ fontSize: "1.5rem" }}>{obj.complement ?? "\u00A0"}</dd>
                  </dl>
                </div>
              ))}
            </div>
          </main>
        </div>
      ))}
    </div>
  );
};
