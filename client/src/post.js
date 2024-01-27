import { format} from "date-fns";
export default function Post({title,summary,cover,content,createdAt,author}){
    return (
        <div className="post">
        <div className="image">
          <img src="https://techcrunch.com/wp-content/uploads/2021/09/GettyImages-1227124572.jpg?w=1390&crop=1" alt=""/>
        </div>
        <div className="text">
          <h2>{title}</h2>
          <p className="info">
            <a className="author">{author.username}</a>
            <time>{format(new Date(createdAt),'MMM d, yyyy HH:mm')}</time>
          </p>
          <p className="summary">{summary}</p>
        </div>
      </div>
      
    );
}