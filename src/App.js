import logo from './logo.svg';
import './App.css';
import {useState} from 'react' //react의 useState함수를 사용할거야


function HeaderTag(props){
  const onClickHeader = (e) => {
    e.preventDefault();
    props.onChangeMode(); //이게 실행되면, onChangeModeHeader 함수가 실행된다
  }
  return(
    <header>
      <h1>
        <a onClick={onClickHeader} href="index.html">WEB</a>
      </h1>
    </header>
  )
}

function ReadTag(props){
  return (
    <article>
      <h2>{props.title}</h2>
      {props.desc}
    </article>
  )
}

function NavTag(props){
  console.log('props.data', props.data);

  const clickHander = (e) => {
    e.preventDefault(); //a태그는 클릭하면 다음페이지로 넘어가는데, 넘어가지 않도록 막아주는 역할! (e:event의 객체)
    props.onChangeMode(Number(e.target.dataset.id)); //이게 실행되면, onChangeModeNav 함수가 실행된다
  }

  let lis = [];
  for(let i=0; i<props.data.length; i++){
    lis.push(<li><a data-id={props.data[i].id} onClick={clickHander}
      href={props.data[i].id+'.html'}>{props.data[i].title}</a></li>);
  }

  return (
    <nav>
      <ol>
        {lis}
      </ol>
    </nav>
  )
}
/////////

function Create(props){
  return (
    <form onSubmit={e=>{
      e.preventDefault();
      var title = e.target.title.value;
      var desc = e.target.desc.value;
      props.onCreate({
        title:title,
        desc:desc
      });
    }}>
      <h2>Create</h2>
      <p><input name="title" type="text" placeholder="title"></input></p>
      <p><textarea name="desc" placeholder="description"></textarea></p>
      <p><input type="submit"></input></p>
    </form>
  )
}


function Update(props){
  return(
    <form onSubmit={e=>{
      e.preventDefault();
      var title = e.target.title.value;
      var desc = e.target.desc.value;
      props.onCreate({
        title:title,
        desc:desc
      });
    }}>
      <h2>Update</h2>
      <p><input name="title" type="text" placeholder="title" value={props.title}></input></p>
      <p><textarea name="desc" placeholder="description" value={props.desc}></textarea></p>
      <p><input type="submit"></input></p>
    </form>
  )
}

///////////

function App() {  
  console.log('App render');
  const [nextId, setNextId] = useState(3);
  const [mode, setMode] = useState('CREATE'); 
  const [id, setId] = useState(1);
  let [topics, setTopics] = useState([
    {id:1, title:'HTML', desc:'HTML is ...'},
    {id:2, title:'CSS', desc:'CSS is ...'}
  ]);

  const onChangeModeHeader = () => {
    console.log('onChangeModeHeader');
    setMode('WELCOME');
  }
  const onChangeModeNav = (id) => {
    console.log('onChangeModeNav', id);
    setMode('READ');
    setId(id);
  }
  const onChangeModeControl = (_mode) => {
    console.log('onChangeModeControl', _mode);
    setMode(_mode);
  }

  let article = null;
  if(mode === 'WELCOME'){
    article = <ReadTag title="Weclome" desc="Hello, WEB"></ReadTag>
  }else if(mode === 'READ'){
    for(let i=0; i<topics.length; i++){
      if(topics[i].id === id){
        article = <ReadTag title={topics[i].title} desc={topics[i].desc}></ReadTag>
        break;
      }
    }
  } else if(mode === 'CREATE'){
    article = <Create onCreate={data=>{
      var newTopics = [...topics];
      newTopics.push({
        "id":nextId,
        "title":data.title,
        "desc":data.desc
      });
      setTopics(newTopics);
      setMode('READ');
      setId(nextId);
      setNextId(nextId+1);
    }}></Create>
  } else if(mode === 'UPDATE'){
    for(let i=0; i<topics.length; i++){ //필터 이용하면 1줄로 요약 가능
      if(topics[i].id === id){
        article = <Update title={topics[i].title} desc={topics[i].desc} onUpdate={data=>{
          //수정관련일
          console.log('update', data);
          var newTopics = [...topics];
          for(let i=0; i<newTopics.length; i++){
            if(newTopics[i].id === id){
              newTopics[i] = {
                "id" : newTopics[i].id,
                "title":data.title,
                "desc":data.desc
              }
            }
          }
          setTopics(newTopics);
          setMode('READ');
        }}></Update>
        break;
      }
    }
  }

  return (
    <div>
      <HeaderTag onChangeMode={onChangeModeHeader}></HeaderTag>
      <NavTag onChangeMode={onChangeModeNav} data={topics}></NavTag>
      {article}
      <Control onChangeMode={onChangeModeControl}></Control>
    </div>
  );
}

function Control(props){
  const clickHander = (e) => {
    e.preventDefault();
    props.onChangeMode(e.target.dataset.mode);
  }

  return(
    <div>
      <a href="/create" data-mode="CREATE" onClick={clickHander}>create</a> | 
      <a href="/update" data-mode="UPDATE" onClick={clickHander}>update</a> | 
      <input type="button" value="delete" data-mode="DELETE" onClick={clickHander}/>
        
      {/* 클릭하면 create&update 페이지로 감
      BUT 삭제는 : 클릭시 오퍼레이션 한다. (삭제링크가 있으면 안됨) 
      <a href="/delete">delete</a> 이면 안됨 */}
    </div>
  );
}

export default App;