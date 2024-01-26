export default function Post({title,summary,cover,content}){
    return (
        <div className="post">
        <div className="image">
          <img src="https://techcrunch.com/wp-content/uploads/2021/09/GettyImages-1227124572.jpg?w=1390&crop=1" alt=""/>
        </div>
        <div className="text">
          <h2>{title}</h2>
          <p className="info">
            <a className="author">Nashandi</a>
            <time>09-01-2024 15:36</time>
          </p>
          <p className="summary">{summary}</p>
        </div>
      </div>
      
    );
}