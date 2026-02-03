const response = await fetch(
  "https://report.microservice.zensoft.com.br/report/generate",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      engine: "jsx",
      template: {
        source:
          'export default (data) => {\r\n  const number = (value) =>\r\n    new Intl.NumberFormat("pt-BR", {\r\n      minimumFractionDigits: 2,\r\n      maximumFractionDigits: 2,\r\n    }).format(value);\r\n\r\n  const text = (value) => (\r\n    <strong>{value?.toUpperCase()}</strong>\r\n  );\r\n\r\n  return (\r\n    <>\r\n      <h1>Hello, {text(data.name)}!</h1>\r\n      <ul>\r\n        {data.items?.map((item, index) => (\r\n          <li key={index}>\r\n            Item {index + 1}, valor {number(item)}\r\n          </li>\r\n        ))}\r\n      </ul>\r\n    </>\r\n  );\r\n};\r\n',
      },
      assets: {
        styles: null,
      },
    }),
  },
);
if (response.ok) {
  const data = await response.json();
  console.log(`\x1b[32m[SUCCESS]\x1b[0m ${data.url}`);
} else {
  const data = await response.text();
  console.error(`\x1b[31m[ERROR]\x1b[0m ${data}`);
}
