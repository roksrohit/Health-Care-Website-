const express = require('express');
const path = require('path');

const router = express.Router({ mergeParams: true });

// GET ROUTES
// router.set('views', path.join(__dirname, 'views'));
router.use(express.static('public'));



// home and logout access

router.get('/', (req, res) => {
  const data = {};
  data.user = req.user;
  
  res.render('home', { data });
});
router.get('/about', (req, res) => {
  res.send(
    '<header> <h1>About Us</h1> </header> <br/> <main><section><h2>Welcome to Health care Portal</h2><p>Recognised by Dental Council of India, Ministry of Health & Family Welfare, Government of India vide its letter no. V-12017/48/2000-PMS/DE Dated 9th Nov. 2006 and is affiliated to Dr. B. R. Ambedkar University, Agra (U.P.).Kanti Devi Dental College was founded by Rajiv Memorial Academic Welfare Society in 2001 to add another branch in the chain of institutions of R.K.Group.The institute is duly recognised by Dental Council of India, Ministry of Health & Family Welfare, Government of India vide its letter no. V-12017/48/2000-PMS/DE Dated 9th Nov. 2006 and is affiliated to Dr. B. R. Ambedkar University, Agra (U.P.)The Institute is spread over more than five acres of lush green beautifully landscaped area at a distance of 125 kms. from Delhi and 50 kms. from Agra at Mathura-Delhi National Highway # 2.</p></section><section><h2>Why Us</h2><p>A curriculum that is well structured and is continuously evolving to give you the cutting edge over competition globally. An institute that gives you personalized care and looks after you as a human being rather than just a human doing.A highly modern and professionally run institute that values and nurtures traditions and values which in turn will help us become great professionals with a sheer difference. An institution or Group that has its own credibility, has a great faculty, right up to the directors’ profile. Faculty that is indeed enviable. Faculty that can take the position of a true mentor and a role model. Faculty that doesn’t just delivers great lectures but is always ready by your side to help you challenge your limits.An institute that takes the genuine pain of buying the best equipments and accessories in lieu of old and reconditioned stuff that some how can never give the required levels of either results or satisfaction.</p><h1>Mission</h1><p>A dynamic education system fosters an equitable, productive economy in a global environment. Kanti Devi Dental College & Hospital has thus set itself the task of contributing to the development and nurturing of talent, encouraging personal performance and developing an awareness of values among the students.Our team invests in intensive, challenging, fascinating and well- organized education. Education provided is based upon 3 core competencies of KNOWLEDGE, SKILLS & PROFESSIONAL ATTITUDE. To develop students as a change agent and powerful role model with entrepreneurial aspirations along with strong moral and ethical values and social sensitivity.</p></main><br><hr><h1>Quick Links</h1><p>Home Services About Doctors Book Review Blogs</p><h1Our Services</h1> <p>Dental Care Massage Therapy Cardioloty Diagnosis Ambulance Service</p><h1>Contact Info</h1><p>+123-456-7890 +111-222-3333 Jatinkumar@Gmail.Com Nikeshsingh@Gmail.Com Mumbai, India - 400104</p><h1>Follow Us</h1><p>+123-456-7890 Twitter Instagram Linkedin Pintrest Credit By Mr. Web Designer | All Rights Reserved</p>'
  )
});
router.get('/faq',(req,res)=>{
  res.send(
    '<header> <h2>Common Questions and Answers</h2> </header> <br/> <h4>1.What is Your Company Name and what services do you offer?</h4> <p>Provide a concise overview of your hosting platform, including the types of hosting services you offer (shared hosting, VPS, dedicated servers, etc.), any unique features, and the benefits of choosing your platform.</p><h4>2.How do I choose the right hosting plan for my needs?</h4><p>Offer guidance on factors to consider when selecting a hosting plan, such as website traffic, storage requirements, performance needs, and budget. Mention any tools or resources you provide to help customers make an informed decision.</p> <h4>3.What are the differences between shared hosting, VPS, and dedicated servers?</h4> <p>:-Briefly explain each type of hosting service, highlighting the key differences in terms of performance, scalability, cost, and control. Provide examples of scenarios where each type might be suitable.</p> <h4>4.How do I migrate my website to your hosting platform?</h4><p>Outline the steps involved in migrating a website to your platform, including any tools or assistance you offer to simplify the process. Mention any compatibility considerations or prerequisites.</p><h4>5.Can I upgrade or downgrade my hosting plan? How does that work?</h4><p>Explain your policy regarding plan upgrades and downgrades, including any associated fees or limitations. Provide instructions on how customers can request changes to their hosting plans.</p>'
  )
})
 
// LOGOUT ROUTE
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
