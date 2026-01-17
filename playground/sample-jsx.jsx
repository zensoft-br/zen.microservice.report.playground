export default (data) => {
  const number = (value) =>
    new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  const text = (value) => (
    <strong>{value?.toUpperCase()}</strong>
  );

  return (
    <>
      <h1>Hello, {text(data.name)}!</h1>
      <ul>
        {data.items.map((item, index) => (
          <li key={index}>
            Item {index + 1}, valor {number(item)}
          </li>
        ))}
      </ul>
    </>
  );
};
