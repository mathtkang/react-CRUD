import logo from './logo.svg';
import './App.css';
import {useState} from 'react' //react의 useState함수를 사용할거야
function HeaderTag(props){
  function onClickHeader(e){
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

  function clickHander(e){
    e.preventDefault(); //a태그는 클릭하면 다음페이지로 넘어가는데, 넘어가지 않도록 막아주는 역할! (e:event의 객체)
    props.onChangeMode(Number(e.target.dataset.id)); //이게 실행되면, onChangeModeNav 함수가 실행된다
  }

  var lis = [];
  for(var i=0; i<props.data.length; i++){
    lis.push(<li><a data-id={props.data[i].id} onClick={clickHander}
      href={props.data[i].id+'.html'}>{props.data[i].title}</a></li>);
  }
  //props.data.map(e) => <li>{e.title}</li>;

  return (
    <nav>
      <ol>
        {lis}
      </ol>
    </nav>
  )
}

function App() {  
  console.log('App render');
  const [mode, setMode] = useState('CREATE'); //이게 실행되면서, mode='WELCOME' 가 된다.(읽을 때는 앞에있는 mode로 읽고, 변경할 때는 setMode()함수로 변경)
  //mode의 디폴트 값을 CREATE 로 바꿔준다.
  const [id, setId] = useState(1);
  var topics = [
    {id:1, title:'HTML', desc:'HTML is ...'},
    {id:2, title:'CSS', desc:'CSS is ...'}
  ];

  function onChangeModeHeader(){
    console.log('onChangeModeHeader');
    setMode('WELCOME');
  }
  // HeaderTag의 WEB을 클릭하면 onChangeMode에 입력한 함수가 실행되어 어떤 작업을 하게 하고 싶다.
  function onChangeModeNav(id){
    console.log('onChangeModeNav', id);
    setMode('READ');
    // id값에 다른 UI를 변경하는 코드
    setId(id);
  }

  function onChangeModeControl(_mode){
    console.log('onChangeModeControl', _mode);
    setMode(_mode);
  }

  var article = null;
  if(mode === 'WELCOME'){
    article = <ReadTag title="Weclome" desc="Hello, WEB"></ReadTag>
  }else if(mode === 'READ'){
    for(var i=0; i<topics.length; i++){
      if(topics[i].id === id){ //숫자 === 문자열 (false)
        article = <ReadTag title={topics[i].title} desc={topics[i].desc}></ReadTag>
        break;
      }
    }
  } else if(mode === 'CREATE'){
    article = (
      <form>
        <h2>Create</h2>
        <p><input type="text" placeholder="title"></input></p>
        <p><textarea placeholder="description"></textarea></p>
        <p><input type="submit"></input></p>
      </form>
    )
  } else if(mode === 'UPDATE'){
    article = <div>Update</div>
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
  function clickHander(e){
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