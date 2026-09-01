-- Sample FAQ entries (English, Math, Python)
INSERT INTO faq_knowledge_base (subject, question, answer, keywords) VALUES
('Math', 'What is a derivative?', 'A derivative measures how a function changes as its input changes. It represents the slope of the tangent line at a point.', 'derivative,rate of change,slope,calculus,tangent'),
('Math', 'How do I solve a quadratic equation?', 'Use the quadratic formula: x = (-b ± √(b²-4ac)) / 2a. You can also factor or complete the square when possible.', 'quadratic,equation,formula,factor,polynomial'),
('Math', 'What is the Pythagorean theorem?', 'In a right triangle, a² + b² = c², where c is the hypotenuse and a, b are the other two sides.', 'pythagorean,triangle,hypotenuse,right angle,geometry'),
('English', 'What is a thesis statement?', 'A thesis statement is a single sentence that presents the main argument or point of an essay, usually placed at the end of the introduction.', 'thesis,essay,argument,introduction,writing'),
('English', 'What is a metaphor?', 'A metaphor is a figure of speech that directly compares two unlike things without using "like" or "as".', 'metaphor,figure of speech,comparison,literary device'),
('English', 'How do I cite a source?', 'Use the citation style required by your instructor (MLA, APA, etc.). Include the author, title, and publication details in your bibliography.', 'citation,source,bibliography,MLA,APA,reference'),
('Python', 'What is a variable in Python?', 'A variable is a name that refers to a value stored in memory. You create one with an assignment like x = 10 or message = "hello".', 'variable,assignment,name,value,store'),
('Python', 'What is a for loop?', 'A for loop runs a block of code once for each item in a sequence (such as a list or range). It is useful for repeating tasks a known number of times.', 'for loop,loop,iterate,range,repeat'),
('Python', 'What are Python data types?', 'Basic data types include int (whole numbers), float (decimals), str (text), bool (True/False), and list (ordered collections). Use type() to inspect a value.', 'data types,int,float,str,bool,list,type');

-- Sample slide content (English, Math, Python)
INSERT INTO slide_content (subject, slide_number, title, content_text) VALUES
('Math', '1.1', 'Introduction to Algebra', 'Algebra uses symbols and letters to represent numbers and quantities in formulas and equations.'),
('Math', '1.2', 'Variables and Expressions', 'A variable is a symbol (like x) that stands for an unknown value. An expression combines numbers, variables, and operators.'),
('Math', '2.1', 'Linear Equations', 'A linear equation has the form ax + b = 0. Solve by isolating the variable on one side.'),
('English', '1.1', 'Parts of an Essay', 'An essay has an introduction (with thesis), body paragraphs (with evidence), and a conclusion.'),
('English', '1.2', 'Writing Strong Paragraphs', 'Each paragraph should focus on one main idea, start with a topic sentence, and include supporting details.'),
('English', '2.1', 'Literary Devices', 'Authors use devices like metaphor, simile, and imagery to create vivid meaning and emotional impact.'),
('Python', '1.1', 'Variables and Data Types', 'In Python, you store values in variables using simple names like name = "Alex" or age = 16. Common data types include strings (text), integers, floats (decimals), and booleans (True/False).'),
('Python', '1.2', 'Working with Numbers and Strings', 'You can do math with +, -, *, and /. Strings can be combined with + and repeated with *. Use type() to check a value''s data type.'),
('Python', '2.1', 'Loops with for', 'A for loop repeats code for each item in a sequence. Example: for i in range(5): print(i) prints 0 through 4. Loops help you avoid writing the same code many times.');

-- Tutor resource links (Math, Python, Java)
INSERT INTO subject_resources (subject, resource_url, resource_label) VALUES
('Python', 'https://drive.google.com/drive/folders/1MMIlX-xOz6kj74rdzr3_sIm1hEjJ6VPO?usp=drive_link', 'Python Tutor Video'),
('Math', 'https://drive.google.com/drive/folders/1X5l8sj35w9PE5ZuIsONHHOfxfg3tSG7U?usp=drive_link', 'Math Tutor Video'),
('Java', 'https://drive.google.com/drive/folders/1OyoQlbDYGNTA-5wWY0Cbadfl9wy1Qusc?usp=drive_link', 'Java Tutor Video');
