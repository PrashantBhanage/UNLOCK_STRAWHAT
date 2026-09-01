-- Sample FAQ entries (Math, Physics, English)
INSERT INTO faq_knowledge_base (subject, question, answer, keywords) VALUES
('Math', 'What is a derivative?', 'A derivative measures how a function changes as its input changes. It represents the slope of the tangent line at a point.', 'derivative,rate of change,slope,calculus,tangent'),
('Math', 'How do I solve a quadratic equation?', 'Use the quadratic formula: x = (-b ± √(b²-4ac)) / 2a. You can also factor or complete the square when possible.', 'quadratic,equation,formula,factor,polynomial'),
('Math', 'What is the Pythagorean theorem?', 'In a right triangle, a² + b² = c², where c is the hypotenuse and a, b are the other two sides.', 'pythagorean,triangle,hypotenuse,right angle,geometry'),
('Physics', 'What is Newton''s first law?', 'An object at rest stays at rest, and an object in motion stays in motion at constant velocity, unless acted upon by an external force. This is the law of inertia.', 'newton,first law,inertia,motion,force'),
('Physics', 'What is velocity?', 'Velocity is the rate of change of position with respect to time. Unlike speed, velocity includes direction.', 'velocity,speed,motion,direction,kinematics'),
('Physics', 'What is energy?', 'Energy is the capacity to do work. It exists in forms such as kinetic, potential, thermal, and chemical energy.', 'energy,work,kinetic,potential,conservation'),
('English', 'What is a thesis statement?', 'A thesis statement is a single sentence that presents the main argument or point of an essay, usually placed at the end of the introduction.', 'thesis,essay,argument,introduction,writing'),
('English', 'What is a metaphor?', 'A metaphor is a figure of speech that directly compares two unlike things without using "like" or "as".', 'metaphor,figure of speech,comparison,literary device'),
('English', 'How do I cite a source?', 'Use the citation style required by your instructor (MLA, APA, etc.). Include the author, title, and publication details in your bibliography.', 'citation,source,bibliography,MLA,APA,reference');

-- Sample slide content (Math, Physics, English)
INSERT INTO slide_content (subject, slide_number, title, content_text) VALUES
('Math', '1.1', 'Introduction to Algebra', 'Algebra uses symbols and letters to represent numbers and quantities in formulas and equations.'),
('Math', '1.2', 'Variables and Expressions', 'A variable is a symbol (like x) that stands for an unknown value. An expression combines numbers, variables, and operators.'),
('Math', '2.1', 'Linear Equations', 'A linear equation has the form ax + b = 0. Solve by isolating the variable on one side.'),
('Physics', '1.1', 'Introduction to Motion', 'Motion describes how an object changes position over time. We measure it using distance, displacement, speed, and velocity.'),
('Physics', '1.2', 'Forces and Newton''s Laws', 'A force is a push or pull. Newton''s three laws describe the relationship between forces and motion.'),
('Physics', '2.1', 'Work and Energy', 'Work is done when a force moves an object. Energy is the ability to do work and comes in many forms.'),
('English', '1.1', 'Parts of an Essay', 'An essay has an introduction (with thesis), body paragraphs (with evidence), and a conclusion.'),
('English', '1.2', 'Writing Strong Paragraphs', 'Each paragraph should focus on one main idea, start with a topic sentence, and include supporting details.'),
('English', '2.1', 'Literary Devices', 'Authors use devices like metaphor, simile, and imagery to create vivid meaning and emotional impact.');
