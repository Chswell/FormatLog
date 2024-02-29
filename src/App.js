import React from "react";
import ReactJson from "react-json-view";

function App() {
  const [text, setText] = React.useState('');
  const [textSearch, setTextSearch] = React.useState('');
  const [formatData, setFormatData] = React.useState([]);


  React.useEffect(() => {
    console.log(formatData.filter(obj => searchInObject(obj, textSearch)))
  }, [formatData, textSearch])

  const searchInObject =(obj, searchText) => {
    // Проверяем, является ли текущий объект строкой и содержит ли он искомый текст
    if (typeof obj === 'string' && obj.toLowerCase().includes(searchText.toLowerCase())) {
      return true;
    }

    // Если текущий объект не строка, проверяем его свойства
    if (typeof obj === 'object' && obj !== null) {
      // Проверяем каждое свойство объекта
      for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
          // Проверяем, содержит ли ключ искомый текст
          if (key.toLowerCase().includes(searchText.toLowerCase())) {
            return true;
          }
          // Рекурсивно вызываем функцию для текущего свойства
          if (searchInObject(obj[key], searchText)) {
            return true;
          }
        }
      }
    }

    // Если ни одно свойство не соответствует условию, возвращаем false
    return false;
  }
  const searchText = (event) => {
    setTextSearch(event.target.value);
  }
  const handleChange = (event) => {
    setText(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const lines = text.split('\n');
    const filteredArray = lines.filter(element => element && element.trim());
    const objectsArray = [];

    filteredArray.forEach(line => {

      const parts = line.split(' - ');
      const jsonStart = parts[2].indexOf('{');
      const jsonString = parts[2].slice(jsonStart);
      const jsonObject = JSON.parse(jsonString);

      const resultObject = {
        "name_service": parts[0],
        "date": parts[1],
        "status": `${parts[2].split(' ')[0]} ${parts[2].split(' ')[1]} ${parts[2].includes('(') ? `(${parts[2].match(/\((.*?)\)/)[1]})` : ""}`, // Извлечение статуса из строки
        "time_request": parts[2].includes('-------------------') ? parts[2].match(/-------------------(.*?)-------------------/)[1] : "", // Извлечение времени запроса, если оно присутствует
        "data": jsonObject.data
      };

      objectsArray.push(resultObject);
    });
    setFormatData(objectsArray);
    console.log(objectsArray)
  };

  return (
    <div className="App" style={{  backgroundColor: "#00000044" }}>
      <form onSubmit={handleSubmit}>
        <div style={{display: "flex", flex: 1, flexDirection: "column", maxWidth: 500}}>
          <textarea style={{maxWidth: 500, maxHeight: 200, minWidth: 100, minHeight: 100}} onChange={handleChange}></textarea>
          <button type={'submit'}>Преобразовать</button>
        </div>
      </form>
      <input type="text" onChange={searchText}/>
    <div>
      <div style={{display: "flex", flexDirection: 'row', justifyContent: "space-between"}}>
        <div style={{minWidth: 150, maxWidth: 150, backgroundColor: "#00000011"}}>Сервис</div>
        <div style={{minWidth: 150, maxWidth: 150, backgroundColor: "#00000033"}}>Дата выполнения</div>
        <div style={{minWidth: 200, maxWidth: 200, backgroundColor: "#00000055"}}>Статус</div>
        <div style={{minWidth: 100, maxWidth: 100, backgroundColor: "#00000077"}}>Время выполнения</div>
        <div style={{flex: 5, backgroundColor: "#00000099"}}>data</div>
      </div>
      {formatData?.filter(obj => searchInObject(obj, textSearch)).map(item =>
        <div style={{
          display: "flex",
          flexDirection: 'row',
          justifyContent: "space-between",
          backgroundColor:
            item.status.includes('ERROR') ? 'rgba(124,0,0,0.55)' :
              item.status.includes('SUCCESS') ? 'rgba(26,68,0,0.56)' : '',
          marginBottom: 10
        }}>
          <div style={{minWidth: 150, maxWidth: 150, minHeight: 30, alignItems: 'center', display: 'flex'}}>{item.name_service}</div>
          <div style={{minWidth: 150, maxWidth: 150, minHeight: 30, alignItems: 'center', display: 'flex'}}>{item.date}</div>
          <div style={{minWidth: 200, maxWidth: 200, minHeight: 30, alignItems: 'center', display: 'flex'}}>{item.status}{item.status.includes('START') ? '--->' : ''}</div>
          <div style={{minWidth: 100, maxWidth: 100, minHeight: 30, alignItems: 'center', display: 'flex'}}>{item.time_request}</div>
          <div style={{flex: 5, alignItems: 'start', display: 'flex', flexDirection: "column"}}>
            <div style={{display: 'flex', flexDirection: 'row', gap: 10}}>
              <div style={{
                backgroundColor:
                  item.data.config.method.includes('GET') ? '#61affe99' :
                    item.data.config.method.includes('PUT') ? '#fca13099' :
                      item.data.config.method.includes('DELETE') ? '#f93e3e99' :
                        item.data.config.method.includes('POST') ? '#49cc9099' : '',
                color: '#fff',
                fontWeight: 600
              }}>{item.data.config.method}</div> {item.data.url}
            </div>
            {item.data.config && <ReactJson style={{backgroundColor: '#ffffff00'}} theme={'google'} src={item.data.config} />}
          </div>
        </div>
      )}
    </div>
    </div>
  );
}

export default App;
