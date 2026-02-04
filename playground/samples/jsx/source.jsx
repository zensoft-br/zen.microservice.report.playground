export default ({ data = [] }) => {
  return (
    <div className="report-wrapper">
      {data.map((obj) => (
        <div className="report-container">
          <h1>Hello, {text(obj.name)}!</h1>
          <ul>
            {obj.items?.map((item, index) => (
              <li key={index}>
                Item {index + 1}, valor {number(item)}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

function number(value) {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function text(value) {
  return <strong>{value?.toUpperCase()}</strong>;
}