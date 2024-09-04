const oracledb = require('oracledb');
async function runApp()
{
  let connection;
  try {
    //change user,password,and connectionString as needed to make a connection to a different database
    connection = await oracledb.getConnection({ user: "C##aweyer", password: "Passw0rd", connectionString: "localhost:1521/FREE" });
    console.log("Successfully connected to Oracle Database");
  
    // Dropping Book table if already created, used for testing and would be removed if implmented
    // Creating Book table and setting value types 
    await connection.execute(`begin execute immediate 'drop table Book'; exception when others then if sqlcode <> -942 then raise; end if; end;`);
    await connection.execute(`create table Book ( 
    ISBN VARCHAR2(14),
    Title VARCHAR2(4000),
    Author VARCHAR2(4000),
    Publisher VARCHAR2(4000),
    Edition NUMBER,
    Price NUMBER,
    Page_Count NUMBER,
    primary key (ISBN)
    )` );
  
    // Inserting book data into table
    const sql = `insert into Book (ISBN, Title, Author, Publisher, Edition, Price, Page_Count) values(:1, :2, :3, :4, :5, :6, :7)`;
    const rows = [ ["978-0062315007", "To Kill a Mockingbird", "Harper Lee", "Harper Perennial Modern", 3, 12.99, 336], 
    ["978-0671027032", "The 7 Habits of Highly Effective People", "Stephen R. Covey", "Free Press", 2, 19.99, 432],
    ["978-0141036144","Outliers: The Story of Success", "Malcolm Gladwell", "Little, Brown and Company", 1, 17.99, 320], 
    ["978-1501124020", "The Road", "Cormac McCarthy", "Vintage International", 1, 11.99, 297], 
    ["978-0735211292", "Educated: A Memoir", "Tara Westover", "Random House", 1, 14.99, 400] ];
    let result = await connection.executeMany(sql, rows);
    console.log(result.rowsAffected, "Rows Inserted");
    connection.commit();
  




//Query that returns all the titles in the table
bookInfo = await connection.execute(
    `SELECT * FROM BOOK`, 
    [], 
    { outFormat: oracledb.OUT_FORMAT_OBJECT }
  );
  
  const rs = bookInfo.resultSet; 
  // let row;
  
  console.log(bookInfo.rows)
//Query to find data based on ISBN
let ISBN='978-0735211292';
SingleQuery = await connection.execute(
  `SELECT * FROM BOOK WHERE ISBN=:isbn`,
  [ISBN],
  { outFormat: oracledb.OUT_FORMAT_OBJECT }
);
  console.log(`"Information for the book that has ISBN of " ${ISBN} is`, SingleQuery.rows[0])
  //Error Handling
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

runApp();