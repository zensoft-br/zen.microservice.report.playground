export default async function ({ getData, meta = {}, t }) {  
  const data = await getData();

  return <h1>Hello, {data}!</h1>;
}