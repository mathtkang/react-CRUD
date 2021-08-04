import logo from './logo.svg';
import './App.css';
import {useState} from 'react'

function HeaderTag(props){
  const onClickHeader = (e) => {
    e.preventDefault();
    props.onChangeMode();
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
    e.preventDefault();
    props.onChangeMode(Number(e.target.dataset.id));
  }

  let lis = [];
  for(let i=0; i<props.data.length; i++){
    lis.push(<li key={props.data[i].id}><a data-id={props.data[i].id} onClick={clickHander}
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
  var [title, setTitle] = useState(props.title);
  var [desc, setDesc] = useState(props.desc);

  return(
    <form onSubmit={e=>{
      e.preventDefault();
      var title = e.target.title.value;
      var desc = e.target.desc.value;
      props.onUpdate({
        title:title,
        desc:desc
      });
    }}>
      <h2>Update</h2>
      <p><input 
        name="title" 
        type="text" 
        placeholder="title" 
        onChange={e=>{
          console.log(e.target.value);
          setTitle(e.target.value)
        }} //기존의 
        value={title}
      ></input></p>
      <p><textarea 
        onChange={e=>setDesc(e.target.value)}
        name="desc" placeholder="description" 
        value={desc}
      ></textarea></p>
      <p><input type="submit"></input></p>
    </form>
  )
}

function App() {  
  console.log('App render');
  const [nextId, setNextId] = useState(3);
  const [mode, setMode] = useState('CREATE'); 
  const [id, setId] = useState(1);
  const [topics, setTopics] = useState([
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
    if(_mode === 'DELETE'){
      var newTopics = [];
      for(let i=0; i<topics.length; i++){
        if(topics[i].id === id){
        } else {
          newTopics.push(topics[i]);
        }
      }
      setTopics(newTopics);
    } else {
      setMode(_mode);
    }
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
          console.log('update', data);
          //수정관련
          var newTopics = [...topics];
          for(let i=0; i<newTopics.length; i++){
            if(newTopics[i].id === id){
              newTopics[i] = {
                id : newTopics[i].id, 
                //...newTopics[i], //spread operator 사용 : 업데이트 되는 부분만 바꾼다
                title : data.title,
                desc : data.desc
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
    </div>
  );
}

export default App;