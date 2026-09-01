-- Sample FAQ entries (Math, Python, Java, Database-SQL)
INSERT INTO faq_knowledge_base (subject, question, answer, keywords) VALUES
('Math', 'What is a derivative?', 'A derivative measures how a function changes as its input changes. It represents the slope of the tangent line at a point.', 'derivative,rate of change,slope,calculus,tangent'),
('Math', 'How do I solve a quadratic equation?', 'Use the quadratic formula: x = (-b ± √(b²-4ac)) / 2a. You can also factor or complete the square when possible.', 'quadratic,equation,formula,factor,polynomial'),
('Math', 'What is the Pythagorean theorem?', 'In a right triangle, a² + b² = c², where c is the hypotenuse and a, b are the other two sides.', 'pythagorean,triangle,hypotenuse,right angle,geometry'),
('Python', 'What is a variable in Python?', 'A variable is a name that refers to a value stored in memory. You create one with an assignment like x = 10 or message = "hello".', 'variable,assignment,name,value,store'),
('Python', 'What is a for loop?', 'A for loop runs a block of code once for each item in a sequence (such as a list or range). It is useful for repeating tasks a known number of times.', 'for loop,loop,iterate,range,repeat'),
('Python', 'What are Python data types?', 'Basic data types include int (whole numbers), float (decimals), str (text), bool (True/False), and list (ordered collections). Use type() to inspect a value.', 'data types,int,float,str,bool,list,type'),
('Java', 'What is a variable in Java?', 'A variable is a named container that holds a value. In Java you must declare its type, e.g. int count = 5; or String name = "Alex";. Common types include int, double, boolean, and String.', 'variable,declaration,type,int,double,boolean,string'),
('Java', 'What is a class and an object?', 'A class is a blueprint that defines fields (data) and methods (behaviour). An object is an instance of a class created with the new keyword, e.g. Dog myDog = new Dog();.', 'class,object,instance,blueprint,new,fields,methods'),
('Java', 'What is inheritance in Java?', 'Inheritance lets a new class (subclass) reuse fields and methods from an existing class (superclass) using the extends keyword. It promotes code reuse and establishes an is-a relationship.', 'inheritance,extends,superclass,subclass,parent,child,oop'),
('Database-SQL', 'What is a table, row, and column?', 'A table is a structured set of data organised in rows and columns. Each row is a single record and each column defines a specific field (e.g. name, age) with a data type.', 'table,row,column,record,field,datatype,structure'),
('Database-SQL', 'How do I write a basic SELECT query?', 'Use SELECT to retrieve data: SELECT column1, column2 FROM table_name; You can filter with WHERE (e.g. WHERE age > 18) and sort with ORDER BY.', 'select,query,from,where,order by,retrieve,data'),
('Database-SQL', 'What is a primary key?', 'A primary key is a column (or set of columns) that uniquely identifies each row in a table. It cannot be NULL and must be unique, e.g. student_id in a students table.', 'primary key,unique,identifier,row,id,constraint');

-- Sample slide content (Math, Python, Java, Database-SQL)
INSERT INTO slide_content (subject, slide_number, title, content_text) VALUES
('Math', '1.1', 'Introduction to Algebra', 'Algebra uses symbols and letters to represent numbers and quantities in formulas and equations.'),
('Math', '1.2', 'Variables and Expressions', 'A variable is a symbol (like x) that stands for an unknown value. An expression combines numbers, variables, and operators.'),
('Math', '2.1', 'Linear Equations', 'A linear equation has the form ax + b = 0. Solve by isolating the variable on one side.'),
('Python', '1.1', 'Variables and Data Types', 'In Python, you store values in variables using simple names like name = "Alex" or age = 16. Common data types include strings (text), integers, floats (decimals), and booleans (True/False).'),
('Python', '1.2', 'Working with Numbers and Strings', 'You can do math with +, -, *, and /. Strings can be combined with + and repeated with *. Use type() to check a value''s data type.'),
('Python', '2.1', 'Loops with for', 'A for loop repeats code for each item in a sequence. Example: for i in range(5): print(i) prints 0 through 4. Loops help you avoid writing the same code many times.'),
('Java', '1.1', 'Variables and Data Types', 'Java is a statically typed language, so every variable must have a declared type. Common types include int for whole numbers, double for decimals, boolean for true/false, and String for text.'),
('Java', '1.2', 'Classes and Objects', 'A class defines the structure and behaviour of an object. Create an object with the new keyword: Dog myDog = new Dog();. Fields store data and methods define actions.'),
('Java', '2.1', 'Inheritance and Polymorphism', 'Inheritance lets a subclass reuse code from a superclass using extends. Polymorphism lets you treat a subclass object as its parent type, so the same method call can behave differently depending on the actual object.'),
('Database-SQL', '1.1', 'Tables, Rows, and Columns', 'A database stores data in tables. Each table has columns (fields like name, age) and rows (individual records). Every table should have a primary key column that uniquely identifies each row.'),
('Database-SQL', '1.2', 'Basic SELECT Queries', 'Use SELECT to read data from a table. SELECT * FROM students; returns every row. Add WHERE to filter: SELECT name FROM students WHERE grade = ''A''; . Use ORDER BY to sort results.'),
('Database-SQL', '2.1', 'Primary Keys and Data Types', 'A primary key uniquely identifies each row and cannot be NULL. Common SQL data types include INT, VARCHAR(n) for text, DATE, and DECIMAL. Choosing the right types keeps your data accurate and queries fast.');

-- Tutor resource links (Python, Math, Java, Database-SQL)
INSERT INTO subject_resources (subject, resource_url, resource_label) VALUES
('Python', 'https://drive.google.com/drive/folders/1AttUweVsZc6d19rWqt7DNWXAk2liufiF?usp=drive_link', 'Python Study Material'),
('Math', 'https://drive.google.com/drive/folders/1IEnd8p5HmVASkArJ6wtmrhuBuQimrUYv?usp=drive_link', 'Math Study Material'),
('Java', 'https://drive.google.com/drive/folders/13VK96qXyp_4G-K7MJPJwpmj7a-oedxdp?usp=drive_link', 'Java Study Material'),
('Database-SQL', 'https://drive.google.com/drive/folders/16waGgp6ZP0JQHrHvLU6U57LMKF08L70C?usp=drive_link', 'Database-SQL Study Material');
