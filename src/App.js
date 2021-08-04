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
  const [nextId, setNextId] = useState(3);
  const [mode, setMode] = useState('CREATE'); //이게 실행되면서, mode='WELCOME' 가 된다.(읽을 때는 앞에있는 mode로 읽고, 변경할 때는 setMode()함수로 변경)
  //mode의 디폴트 값을 CREATE 로 바꿔준다.
  const [id, setId] = useState(1);
  // let topics = [ //평범한 변수인 topics는 state가 아니기 때문에 다시 리로드 되지 않는다.
  let [topics, setTopics] = useState([
    {id:1, title:'HTML', desc:'HTML is ...'},
    {id:2, title:'CSS', desc:'CSS is ...'}
    //article에 의해 받은 값을 여기에 넣어줌
  ]);

  const onChangeModeHeader = () => {
    console.log('onChangeModeHeader');
    setMode('WELCOME');
  }
  // HeaderTag의 WEB을 클릭하면 onChangeMode에 입력한 함수가 실행되어 어떤 작업을 하게 하고 싶다.
  const onChangeModeNav = (id) => {
    console.log('onChangeModeNav', id);
    setMode('READ');
    // id값에 다른 UI를 변경하는 코드
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
      if(topics[i].id === id){ //숫자 === 문자열 (false)
        article = <ReadTag title={topics[i].title} desc={topics[i].desc}></ReadTag>
        break;
      }
    }
  } else if(mode === 'CREATE'){
    const onSubmitHandler = (e) => {
      e.preventDefault();
      const title = e.target.title.value;
      const desc = e.target.desc.value;
      // topics.push({ 
      //   "id" : 3,
      //   "title" : title,
      //   "desc" : desc
      // });
      // setTopics(topics); //불변성, 가변성에 의해서 (복제후)아래와 같이 사용해줘야함

      let newTopics = [...topics];
      newTopics.push({
        "id" : nextId,
        "title" : title,
        "desc" : desc
      });
      setTopics(newTopics);
      // 위의 newTopics 와 같은 방식
      // setTopics([...topics,{
      //   "id":3,
      //   "title":title,
      //   "desc":desc
      // }]
      setMode('READ');
      setId(nextId);
      setNextId(nextId+1);

    }
    article = (
      <form onSubmit={onSubmitHandler}>
        <h2>Create</h2>
        <p><input name="title" type="text" placeholder="title"></input></p>
        <p><textarea name="desc" placeholder="description"></textarea></p>
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