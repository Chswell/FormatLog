import React from "react";

function App() {
  const [text, setText] = React.useState('');
  const [textSearch, setTextSearch] = React.useState('');
  const [formatData, setFormatData] = React.useState([]);
  const [isShow, setIsShow] = React.useState(true);


  React.useEffect(() => {
  }, [formatData, textSearch])

  const searchInObject = (obj, searchText) => {
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
      const jsonStart = line.indexOf('{')
      const jsonString = line.slice(jsonStart)
      const descInfo = line.substring(0, jsonStart);

      const parts = descInfo.split(' - ');
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
  };

  return (
    <div className="App" style={{  backgroundColor: "#00000044" }}>
      <div style={{position: 'fixed', right: 0, top: 0, left: 0, backgroundColor: "#312f2f", zIndex: 1000}}>
        <form onSubmit={handleSubmit}>
          <div style={{display: "flex", flex: 1, maxWidth: 500, alignItems: 'center', gap: 50}}>
            <textarea style={{maxWidth: 500, maxHeight: 200, minWidth: 500, minHeight: 100}} onChange={handleChange}></textarea>
            <button style={{height: 40}} type={'submit'}>Преобразовать</button>
          </div>
        </form>
        <input style={{position: 'fixed', right: 10, top: 10, width: 400, height: 30 }} placeholder={'Поиск'} type="text" onChange={searchText}/>
        <button onClick={() => setIsShow(true)}>Показать все столбцы</button>
        <div style={{display: "flex", flexDirection: 'row', justifyContent: "space-between", gap: 1}}>
          {isShow ? <div style={{minWidth: 150, maxWidth: 150, backgroundColor: "#00000099"}}>Сервис <button onClick={() => setIsShow(false)}>скрыть</button></div> : null}
          <div style={{minWidth: 150, maxWidth: 150, backgroundColor: "#00000099"}}>Дата выполнения</div>
          <div style={{minWidth: 200, maxWidth: 200, backgroundColor: "#00000099"}}>Статус</div>
          <div style={{minWidth: 100, maxWidth: 100, backgroundColor: "#00000099"}}>Время выполнения</div>
          <div style={{flex: 5, backgroundColor: "#00000099"}}>data</div>
        </div>
      </div>
    <div>

      {formatData?.filter(obj => searchInObject(obj, textSearch)).map((item, index) =>
        <div style={{
          display: "flex",
          flexDirection: 'row',
          justifyContent: "space-between",
          backgroundColor:
            item.status.includes('ERROR') ? 'rgba(124,0,0,0.55)' :
            item.status.includes('SUCCESS') ? 'rgba(26,68,0,0.56)' : '',
          marginBottom: 10
        }}
        key={index}>
          {isShow ? <div style={{minWidth: 150, maxWidth: 150, minHeight: 30, alignItems: 'center', display: 'flex'}}>{item.name_service}</div> : null}
          <div style={{minWidth: 150, maxWidth: 150, minHeight: 30, alignItems: 'center', display: 'flex'}}>{item.date}</div>
          <div style={{minWidth: 200, maxWidth: 200, minHeight: 30, alignItems: 'center', display: 'flex'}}>{item.status}{item.status.includes('START') ? '--->' : ''}</div>
          <div style={{minWidth: 100, maxWidth: 100, minHeight: 30, alignItems: 'center', display: 'flex'}}>{item.time_request}</div>
          <div style={{flex: 5, alignItems: 'start', flexDirection: "column", display: 'inline-block', wordBreak: 'break-word', wordWrap: 'break-word', overflowWrap: 'break-word', whiteSpace: 'pre-wrap'}}>
            <div style={{display: 'flex', flexDirection: 'row', gap: 10}}>
              <div style={{
                backgroundColor:
                  item.data?.config?.method.includes('GET') ? '#61affe99' :
                  item.data?.config?.method.includes('PUT') ? '#fca13099' :
                  item.data?.config?.method.includes('DELETE') ? '#f93e3e99' :
                  item.data?.config?.method.includes('POST') ? '#49cc9099' : '',
                color: '#fff',
                fontWeight: 600
              }}>{item.data?.config?.method}</div> {item.data?.url}
            </div>
            <div style={{display: 'inline-block', wordBreak: 'break-word', wordWrap: 'break-word', overflowWrap: 'break-word', whiteSpace: 'pre-wrap', paddingRight: 10}}>
              {item.data.config ? 'config: ' : ''}{JSON.stringify(item.data.config)}
            </div>
            <div style={{display: 'inline-block', wordBreak: 'break-word', wordWrap: 'break-word', overflowWrap: 'break-word', whiteSpace: 'pre-wrap', paddingRight: 10}}>
              {item.data.body ? 'body: ' : ''}{JSON.stringify(item.data.body)}
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}

export default App;
