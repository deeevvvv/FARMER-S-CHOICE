import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const LANGUAGE_STORAGE_KEY = "fc_language";

// Human-facing UI translations used by the current Farmer's Choice MVP.
// Product/farmer/business names are intentionally left unchanged.
const HI = {
  "Farmer's Choice": "फार्मर्स चॉइस",
  "Marketplace": "मार्केटप्लेस",
  "TULIP AI": "TULIP AI",
  "Logistics": "लॉजिस्टिक्स",
  "Pricing": "मूल्य",
  "Dashboard": "डैशबोर्ड",
  "Log in": "लॉग इन",
  "Sign up": "साइन अप",
  "Log out": "लॉग आउट",
  "Cart": "कार्ट",
  "Language": "भाषा",
  "English": "English",
  "Hindi": "हिन्दी",
  "Back home": "होम पर वापस जाएं",
  "Go Home": "होम पर जाएं",
  "Page not found": "पेज नहीं मिला",
  "The page you're looking for doesn't exist.": "आप जिस पेज को खोज रहे हैं वह मौजूद नहीं है।",
  "Welcome back": "वापसी पर स्वागत है",
  "One marketplace.": "एक मार्केटप्लेस।",
  "Choose your way in.": "अपनी भूमिका चुनें।",
  "Current workspace": "वर्तमान वर्कस्पेस",
  "quick demo": "त्वरित डेमो",
  "Quick demo": "त्वरित डेमो",
  "Demo login uses the sample data already bundled with the MVP.": "डेमो लॉगिन में MVP के साथ दिया गया सैंपल डेटा उपयोग होता है।",
  "Sign in to the workspace that matches how you use Farmer's Choice. Your dashboard and tools will be tailored to your role.": "अपनी भूमिका के अनुसार वर्कस्पेस में साइन इन करें। आपका डैशबोर्ड और टूल्स उसी भूमिका के अनुसार दिखेंगे।",
  "Farmer": "किसान",
  "Consumer": "उपभोक्ता",
  "Bulk Buyer": "थोक खरीदार",
  "Farmer Login": "किसान लॉग इन",
  "Consumer Login": "उपभोक्ता लॉग इन",
  "Bulk Buyer Login": "थोक खरीदार लॉग इन",
  "Enter Farmer Demo": "किसान डेमो खोलें",
  "Enter Consumer Demo": "उपभोक्ता डेमो खोलें",
  "Enter Bulk Buyer Demo": "थोक खरीदार डेमो खोलें",
  "Manage your harvest, buyers, storage and TULIP insights.": "अपनी फसल, खरीदार, भंडारण और TULIP जानकारी प्रबंधित करें।",
  "Shop fresh produce directly from verified farmers.": "सत्यापित किसानों से सीधे ताज़ी उपज खरीदें।",
  "Post large requirements and connect directly with farmers.": "बड़ी आवश्यकताएं पोस्ट करें और सीधे किसानों से जुड़ें।",
  "Create your account.": "अपना अकाउंट बनाएं।",
  "Choose your role.": "अपनी भूमिका चुनें।",
  "Create account as": "अकाउंट बनाएं —",
  "Create account": "अकाउंट बनाएं",
  "Full name": "पूरा नाम",
  "Email": "ईमेल",
  "Email address": "ईमेल पता",
  "Password": "पासवर्ड",
  "Confirm password": "पासवर्ड की पुष्टि करें",
  "At least 8 characters": "कम से कम 8 अक्षर",
  "Your name or contact person": "आपका नाम या संपर्क व्यक्ति",
  "Your full name": "आपका पूरा नाम",
  "Create a strong password": "एक मजबूत पासवर्ड बनाएं",
  "Re-enter your password": "अपना पासवर्ड फिर से दर्ज करें",
  "Show password": "पासवर्ड दिखाएं",
  "Hide password": "पासवर्ड छिपाएं",
  "Show confirmation password": "पुष्टि पासवर्ड दिखाएं",
  "Hide confirmation password": "पुष्टि पासवर्ड छिपाएं",
  "✓ Passwords match": "✓ पासवर्ड मेल खाते हैं",
  "Passwords do not match": "पासवर्ड मेल नहीं खाते।",
  "Password must contain at least 8 characters.": "पासवर्ड में कम से कम 8 अक्षर होने चाहिए।",
  "Please accept the terms to create your account.": "अकाउंट बनाने के लिए कृपया शर्तें स्वीकार करें।",
  "Already have an account?": "पहले से अकाउंट है?",
  "← Back to homepage": "← होमपेज पर वापस जाएं",
  "I agree to the Farmer's Choice terms and understand that my account is created for the selected role:": "मैं Farmer's Choice की शर्तों से सहमत हूं और समझता/समझती हूं कि मेरा अकाउंट चुनी गई भूमिका के लिए बनाया जाएगा:",
  "Sell your harvest directly": "अपनी फसल सीधे बेचें",
  "List produce, compare buyers and use TULIP insights.": "उपज सूचीबद्ध करें, खरीदारों की तुलना करें और TULIP जानकारी का उपयोग करें।",
  "Shop fresh produce": "ताज़ी उपज खरीदें",
  "Discover farm-direct produce and track your orders.": "खेत से सीधे उपज खोजें और अपने ऑर्डर ट्रैक करें।",
  "Source at scale": "बड़ी मात्रा में खरीदें",
  "Post requirements and connect with matching farmers.": "आवश्यकताएं पोस्ट करें और मिलान वाले किसानों से जुड़ें।",
  "role-based workspaces": "भूमिका आधारित वर्कस्पेस",

  "AI-powered agricultural marketplace": "AI-संचालित कृषि मार्केटप्लेस",
  "From farm to buyer,": "खेत से खरीदार तक,",
  "directly.": "सीधे।",
  "🌾 Join as Farmer": "🌾 किसान के रूप में जुड़ें",
  "🛒 Browse marketplace": "🛒 मार्केटप्लेस देखें",
  "Today's demand signals": "आज की मांग के संकेत",
  "Live marketplace view": "लाइव मार्केटप्लेस दृश्य",
  "Supply signal": "आपूर्ति संकेत",
  "Plan ahead": "पहले से योजना बनाएं",
  "Route support": "रूट सहायता",
  "Optimized": "अनुकूलित",
  "Explore the TULIP dashboard": "TULIP डैशबोर्ड देखें",
  "GET STARTED": "शुरू करें",
  "One platform. Three clear ways in.": "एक प्लेटफ़ॉर्म। जुड़ने के तीन स्पष्ट तरीके।",
  "Choose the workspace that matches what you do, with a dedicated dashboard after login.": "अपने काम के अनुसार वर्कस्पेस चुनें और लॉगिन के बाद समर्पित डैशबोर्ड पाएं।",
  "Create a new account": "नया अकाउंट बनाएं",
  "Sign up": "साइन अप",
  "Featured produce": "चुनिंदा उपज",
  "Fresh listings from farmers": "किसानों की ताज़ा लिस्टिंग",
  "View all": "सभी देखें",
  "View →": "देखें →",
  "Farm-fresh listing": "खेत से ताज़ी लिस्टिंग",
  "TULIP intelligence": "TULIP बुद्धिमत्ता",
  "Make the next move with better information.": "बेहतर जानकारी के साथ अगला कदम उठाएं।",
  "Use demand trends, supply signals and route planning together instead of managing each step separately.": "हर चरण को अलग-अलग संभालने के बजाय मांग रुझान, आपूर्ति संकेत और रूट योजना को एक साथ उपयोग करें।",
  "Explore TULIP AI": "TULIP AI देखें",
  "Why Farmer's Choice": "Farmer's Choice क्यों?",
  "A simpler supply chain, built around the people using it.": "उपयोगकर्ताओं के लिए बनाई गई सरल सप्लाई चेन।",
  "Traditional flow": "पारंपरिक प्रवाह",
  "More hand-offs, less visibility": "अधिक बिचौलिए, कम पारदर्शिता",
  "Farmer's Choice": "फार्मर्स चॉइस",
  "Direct access + coordinated tools": "सीधी पहुंच + समन्वित टूल्स",
  "Farmer / FPO": "किसान / FPO",
  "Buyer": "खरीदार",
  "Ready to get closer to the source?": "स्रोत के और करीब जाने के लिए तैयार हैं?",
  "Start as a farmer, shop as a consumer, or source at scale as a bulk buyer.": "किसान के रूप में शुरू करें, उपभोक्ता के रूप में खरीदें या थोक खरीदार के रूप में बड़ी मात्रा में स्रोत करें।",
  "Farmer login": "किसान लॉग इन",
  "Browse produce": "उपज देखें",
  "List your harvest": "अपनी फसल सूचीबद्ध करें",
  "Connect directly": "सीधे जुड़ें",
  "Plan with TULIP": "TULIP के साथ योजना बनाएं",
  "Complete the delivery": "डिलीवरी पूरी करें",
  "Farmers and FPOs add produce, quantity, price, harvest date and location in minutes.": "किसान और FPO कुछ ही मिनटों में उपज, मात्रा, कीमत, फसल की तारीख और स्थान जोड़ सकते हैं।",
  "Consumers and bulk buyers discover available produce without unnecessary hand-offs.": "उपभोक्ता और थोक खरीदार बिना अनावश्यक बिचौलियों के उपलब्ध उपज खोज सकते हैं।",
  "AI-assisted demand forecasts and route planning help coordinate the next move.": "AI-सहायित मांग पूर्वानुमान और रूट योजना अगले कदम को व्यवस्थित करने में मदद करते हैं।",
  "Pickup, consolidation and delivery are coordinated so each side can focus on its role.": "पिकअप, समेकन और डिलीवरी का समन्वय किया जाता है ताकि हर पक्ष अपनी भूमिका पर ध्यान दे सके।",
  "Direct price visibility": "सीधे मूल्य की जानकारी",
  "See quantities, prices and buyer requirements in one transparent marketplace.": "मात्रा, कीमत और खरीदार की आवश्यकताएं एक पारदर्शी मार्केटप्लेस में देखें।",
  "Farm-fresh sourcing": "खेत से ताज़ी उपज",
  "Shorter supply chains can help move produce from farms to buyers more efficiently.": "छोटी सप्लाई चेन उपज को खेत से खरीदार तक अधिक कुशलता से पहुंचाने में मदद कर सकती है।",
  "AI-assisted decisions": "AI-सहायित निर्णय",
  "TULIP turns demand history into practical signals for planning supply and movement.": "TULIP मांग इतिहास को आपूर्ति और आवाजाही की योजना के लिए उपयोगी संकेतों में बदलता है।",
  "Logistics support": "लॉजिस्टिक्स सहायता",
  "Coordinate pickups, delivery points and routes through one connected workflow.": "एक जुड़े हुए वर्कफ़्लो से पिकअप, डिलीवरी पॉइंट और रूट का समन्वय करें।",
  "Demand forecasting from historical sales data": "ऐतिहासिक बिक्री डेटा से मांग का पूर्वानुमान",
  "Supply-to-buyer matching": "आपूर्ति-से-खरीदार मिलान",
  "Route planning across pickup points": "पिकअप पॉइंट्स के बीच रूट योजना",
  "Traditional supply chain": "पारंपरिक सप्लाई चेन",
  "Trader": "व्यापारी",
  "Wholesaler": "थोक व्यापारी",
  "Distributor": "वितरक",
  "Retailer": "रिटेलर",
  "How it works": "यह कैसे काम करता है",
  "From harvest to delivery, in four clear steps": "फसल से डिलीवरी तक, चार स्पष्ट चरणों में",
  "What you get": "आपको क्या मिलेगा",
  "Useful tools without a complicated workflow": "बिना जटिल प्रक्रिया के उपयोगी टूल्स",

  "Bulk buyer workspace": "थोक खरीदार वर्कस्पेस",
  "Source directly from farmers. Post a requirement once, then compare matching farms without the usual back-and-forth.": "किसानों से सीधे स्रोत करें। एक बार आवश्यकता पोस्ट करें और सामान्य बातचीत के बिना मिलान वाले खेतों की तुलना करें।",
  "+ Post requirement": "+ आवश्यकता पोस्ट करें",
  "Demand board": "मांग बोर्ड",
  "Your requirements": "आपकी आवश्यकताएं",
  "+ New": "+ नया",
  "Requirement": "आवश्यकता",
  "Quantity": "मात्रा",
  "Max price": "अधिकतम कीमत",
  "Needed by": "आवश्यक तारीख",
  "Delivery": "डिलीवरी",
  "Status": "स्थिति",
  "Click to view matching farmers →": "मिलान वाले किसानों को देखने के लिए क्लिक करें →",
  "TULIP matching": "TULIP मिलान",
  "Matching farmers": "मिलान वाले किसान",
  "Select a requirement to see farmers who can fulfil your quantity and budget.": "अपनी मात्रा और बजट पूरा करने वाले किसानों को देखने के लिए एक आवश्यकता चुनें।",
  "Finding the closest matches…": "सबसे उपयुक्त मिलान खोजे जा रहे हैं…",
  "No farmers currently match this requirement's price and quantity.": "फिलहाल कोई किसान इस आवश्यकता की कीमत और मात्रा से मेल नहीं खाता।",
  "New sourcing request": "नई सोर्सिंग आवश्यकता",
  "Post a bulk requirement": "थोक आवश्यकता पोस्ट करें",
  "Tell farmers exactly what you need. TULIP will use these details for matching.": "किसानों को बताएं कि आपको ठीक क्या चाहिए। TULIP इन विवरणों का उपयोग मिलान के लिए करेगा।",
  "What do you need?": "आपको क्या चाहिए?",
  "Product and volume you want farmers to quote for.": "वह उत्पाद और मात्रा जिसके लिए आप किसानों से कीमत चाहते हैं।",
  "Category": "श्रेणी",
  "Product name": "उत्पाद का नाम",
  "Required quantity (kg)": "आवश्यक मात्रा (किग्रा)",
  "Maximum price per kg (₹)": "अधिकतम कीमत प्रति किग्रा (₹)",
  "Where and when?": "कहां और कब?",
  "Your delivery deadline and destination.": "आपकी डिलीवरी की अंतिम तारीख और स्थान।",
  "Delivery date": "डिलीवरी तारीख",
  "Delivery location": "डिलीवरी स्थान",
  "TULIP matching is ready": "TULIP मिलान तैयार है",
  "Once posted, your requirement can be matched against farmer inventory using product, price, quantity and delivery needs.": "पोस्ट करने के बाद आपकी आवश्यकता का मिलान किसान इन्वेंटरी से उत्पाद, कीमत, मात्रा और डिलीवरी जरूरतों के आधार पर किया जा सकता है।",
  "Live summary": "लाइव सारांश",
  "Budget ceiling": "बजट सीमा",
  "Destination": "गंतव्य",
  "Your maximum budget is a ceiling, not a guaranteed final price. You can review matching farmer offers before placing an order.": "आपका अधिकतम बजट एक सीमा है, अंतिम कीमत की गारंटी नहीं। ऑर्डर देने से पहले आप मिलान वाले किसानों के प्रस्ताव देख सकते हैं।",
  "Cancel": "रद्द करें",
  "Post requirement →": "आवश्यकता पोस्ट करें →",
  "Requirements posted": "पोस्ट की गई आवश्यकताएं",
  "Open requirements": "खुली आवश्यकताएं",
  "Matched": "मिलान हुआ",
  "Open": "खुला",
  "No requirements posted yet": "अभी तक कोई आवश्यकता पोस्ट नहीं की गई",
  "Post your first bulk requirement to find matching farmers.": "मिलान वाले किसानों को खोजने के लिए अपनी पहली थोक आवश्यकता पोस्ट करें।",
  "Order placed ✓": "ऑर्डर दिया गया ✓",
  "Placing…": "ऑर्डर दिया जा रहा है…",
  "Place bulk order": "थोक ऑर्डर दें",
  "Close": "बंद करें",
  "Your business": "आपका व्यवसाय",
  "e.g. Tomato, Onion, Wheat": "जैसे टमाटर, प्याज, गेहूं",
  "City / market / warehouse": "शहर / बाजार / वेयरहाउस",
  "Your product": "आपका उत्पाद",
  "Quantity not set": "मात्रा निर्धारित नहीं",
  "Farmer produce": "किसान की उपज",
  "Requirement posted": "आवश्यकता पोस्ट की गई",
  "Bulk order placed": "थोक ऑर्डर दिया गया",

  "Welcome back,": "वापसी पर स्वागत है,",
  "Choose what you want to do with your harvest.": "अपनी फसल के साथ क्या करना है, चुनें।",
  "+ Add new produce": "+ नई उपज जोड़ें",
  "POST-HARVEST CENTER": "कटाई के बाद केंद्र",
  "Three ways to handle your harvest": "अपनी फसल संभालने के तीन तरीके",
  "Revenue — last 10 days": "राजस्व — पिछले 10 दिन",
  "TULIP recommendation": "TULIP सुझाव",
  "Post-Harvest Center": "कटाई के बाद केंद्र",
  "Review your recent requests and reopen any harvest pathway.": "अपने हाल के अनुरोध देखें और किसी भी फसल विकल्प को फिर से खोलें।",
  "Recent post-harvest requests": "हाल के कटाई-पश्चात अनुरोध",
  "These demo requests are stored in this page session until the backend workflow is connected.": "बैकएंड वर्कफ़्लो जुड़ने तक ये डेमो अनुरोध इसी पेज सत्र में रखे जाते हैं।",
  "No requests yet. Choose one of the three options above to start.": "अभी कोई अनुरोध नहीं है। शुरू करने के लिए ऊपर दिए तीन विकल्पों में से एक चुनें।",
  "Product": "उत्पाद",
  "Qty (kg)": "मात्रा (किग्रा)",
  "Price/kg": "कीमत/किग्रा",
  "Harvest date": "कटाई की तारीख",
  "Location": "स्थान",
  "Organic": "जैविक",
  "Edit": "संपादित करें",
  "Delete": "हटाएं",
  "Sales analytics": "बिक्री विश्लेषण",
  "Demand forecast for crops relevant to your farm": "आपके खेत से संबंधित फसलों का मांग पूर्वानुमान",
  "Post-Harvest": "कटाई के बाद",
  "Harvest details": "फसल विवरण",
  "Enter the basics once. We’ll use them for this request.": "मूल विवरण एक बार भरें। हम इन्हें इस अनुरोध के लिए उपयोग करेंगे।",
  "Crop": "फसल",
  "Quantity (kg)": "मात्रा (किग्रा)",
  "Farm / pickup location": "खेत / पिकअप स्थान",
  "Harvest / pickup date": "कटाई / पिकअप तारीख",
  "What happens next?": "इसके बाद क्या होगा?",
  "Farmer’s Choice reviews your crop details, prepares a purchase offer, and takes ownership after the sale is completed.": "Farmer’s Choice आपकी फसल का विवरण देखेगा, खरीद प्रस्ताव तैयार करेगा और बिक्री पूरी होने के बाद स्वामित्व लेगा।",
  "Choose a buyer": "खरीदार चुनें",
  "Compare the available offers and select one to continue.": "उपलब्ध प्रस्तावों की तुलना करें और आगे बढ़ने के लिए एक चुनें।",
  "DEMO OFFERS": "डेमो प्रस्ताव",
  "Offer": "प्रस्ताव",
  "Choose a warehouse": "वेयरहाउस चुनें",
  "Pick based on distance, capacity, crop suitability, and storage rate.": "दूरी, क्षमता, फसल उपयुक्तता और भंडारण दर के आधार पर चुनें।",
  "DEMO OPTIONS": "डेमो विकल्प",
  "Rate": "दर",
  "per kg / day": "प्रति किग्रा / दिन",
  "Inventory": "इन्वेंटरी",
  "Add clear crop details so buyers can understand your listing.": "फसल का स्पष्ट विवरण जोड़ें ताकि खरीदार आपकी लिस्टिंग समझ सकें।",
  "Price per kg (₹)": "प्रति किग्रा कीमत (₹)",
  "Farm / location": "खेत / स्थान",
  "Organically grown": "जैविक रूप से उगाई गई",
  "Show an organic badge on your listing.": "अपनी लिस्टिंग पर जैविक बैज दिखाएं।",
  "Submit crop details": "फसल का विवरण भेजें",
  "Receive purchase offer": "खरीद प्रस्ताव प्राप्त करें",
  "Get paid after sale": "बिक्री के बाद भुगतान पाएं",
  "Start buyer matching": "खरीदार मिलान शुरू करें",
  "Select a warehouse first": "पहले एक वेयरहाउस चुनें",
  "Edit your produce": "अपनी उपज संपादित करें",
  "Add product": "उत्पाद जोड़ें",
  "Save changes": "बदलाव सहेजें",
  "Add produce": "उपज जोड़ें",
  "Sell to Farmer's Choice": "फार्मर्स चॉइस को बेचें",
  "Get paid after harvest": "कटाई के बाद भुगतान पाएं",
  "Transfer ownership and let Farmer’s Choice handle the next steps.": "स्वामित्व हस्तांतरित करें और Farmer’s Choice को आगे की प्रक्रिया संभालने दें।",
  "Submit your crop details and receive a direct purchase offer from Farmer’s Choice.": "अपनी फसल का विवरण भेजें और Farmer’s Choice से सीधा खरीद प्रस्ताव पाएं।",
  "Request purchase offer": "खरीद प्रस्ताव मांगें",
  "Fast payout": "तेज़ भुगतान",
  "Find Direct Buyers": "सीधे खरीदार खोजें",
  "Compare buyer offers": "खरीदारों के प्रस्तावों की तुलना करें",
  "Keep ownership until the sale and choose the buyer yourself.": "बिक्री तक स्वामित्व रखें और खुद खरीदार चुनें।",
  "Compare restaurants, wholesalers, retailers, and other buyers by price and quantity.": "रेस्तरां, थोक व्यापारियों, रिटेलरों और अन्य खरीदारों के प्रस्तावों की कीमत और मात्रा के आधार पर तुलना करें।",
  "View buyer offers": "खरीदारों के प्रस्ताव देखें",
  "Farmer decides": "फैसला किसान का",
  "Store & Sell Later": "स्टोर करें और बाद में बेचें",
  "Keep ownership": "स्वामित्व बनाए रखें",
  "Compare local warehouses and decide when to sell later.": "स्थानीय वेयरहाउस की तुलना करें और तय करें कि बाद में कब बेचना है।",
  "Choose storage using distance, capacity, crop suitability, and daily storage cost.": "दूरी, क्षमता, फसल उपयुक्तता और दैनिक भंडारण लागत के आधार पर भंडारण चुनें।",
  "Compare warehouses": "वेयरहाउस की तुलना करें",
  "Flexible timing": "समय में लचीलापन",
  "Nearby": "पास में",
  "Review": "समीक्षा",
  "Dismiss": "हटाएं",
  "Produce updated": "उपज अपडेट की गई",
  "Produce added": "उपज जोड़ी गई",
  "Produce removed": "उपज हटाई गई",
  "Buyer matching requested": "खरीदार मिलान अनुरोध भेजा गया",
  "Warehouse comparison requested": "वेयरहाउस तुलना अनुरोध भेजा गया",
  "Purchase offer requested": "खरीद प्रस्ताव का अनुरोध भेजा गया",
  "Purchase request sent": "खरीद अनुरोध भेजा गया",
  "Buyer matching started": "खरीदार मिलान शुरू हुआ",
  "Storage request created": "भंडारण अनुरोध बनाया गया",
  "We recorded your request and can show matching buyers.": "आपका अनुरोध दर्ज हो गया है और हम मिलान वाले खरीदार दिखा सकते हैं।",
  "We recorded your request and can show matching warehouses.": "आपका अनुरोध दर्ज हो गया है और हम मिलान वाले वेयरहाउस दिखा सकते हैं।",
  "Total earnings": "कुल कमाई",
  "Active orders": "सक्रिय ऑर्डर",
  "Available inventory": "उपलब्ध इन्वेंटरी",
  "Products sold": "बेची गई उपज",
  "Loading dashboard…": "डैशबोर्ड लोड हो रहा है…",
  "No produce listed yet": "अभी कोई उपज सूचीबद्ध नहीं है",
  "Add your first product to start selling.": "बेचना शुरू करने के लिए अपना पहला उत्पाद जोड़ें।",

  "Consumer dashboard": "उपभोक्ता डैशबोर्ड",
  "Everything you need to discover fresh produce, manage your cart and keep track of your direct-from-farm orders.": "ताज़ी उपज खोजने, कार्ट प्रबंधित करने और खेत से सीधे अपने ऑर्डर ट्रैक करने के लिए जरूरी सभी चीज़ें।",
  "Shop now →": "अभी खरीदें →",
  "Cart items": "कार्ट आइटम",
  "Ready for checkout": "चेकआउट के लिए तैयार",
  "Recent orders": "हाल के ऑर्डर",
  "Latest activity": "हाल की गतिविधि",
  "Tracked value": "ट्रैक की गई कीमत",
  "From recent orders": "हाल के ऑर्डर से",
  "Quick actions": "त्वरित कार्य",
  "Your shortcuts": "आपके शॉर्टकट",
  "Open →": "खोलें →",
  "View all →": "सभी देखें →",
  "No recent orders yet. Start by browsing today's harvest.": "अभी कोई हाल का ऑर्डर नहीं है। आज की उपज देखकर शुरुआत करें।",
  "Why Farmer's Choice?": "Farmer's Choice क्यों?",
  "Buy closer to the farm.": "खेत के और करीब से खरीदें।",
  "Find produce listed directly by farmers and FPOs, with transparent prices and a shorter route from harvest to your kitchen.": "किसानों और FPO द्वारा सीधे सूचीबद्ध उपज खोजें, पारदर्शी कीमतों और खेत से आपकी रसोई तक छोटे रास्ते के साथ।",
  "See price transparency →": "मूल्य पारदर्शिता देखें →",
  "Recent order": "हाल का ऑर्डर",

  "Loading product…": "उत्पाद लोड हो रहा है…",
  "Available quantity": "उपलब्ध मात्रा",
  "Harvested on": "कटाई की तारीख",
  "Buy Now": "अभी खरीदें",
  "Added ✓": "जोड़ा गया ✓",
  "Add to Cart": "कार्ट में जोड़ें",
  "Quantity (kg)": "मात्रा (किग्रा)",
  "/ kg": "/ किग्रा",
  "Farmer": "किसान",

  "Search": "खोजें",
  "Categories": "श्रेणियां",
  "Add to cart": "कार्ट में जोड़ें",
  "Buy now": "अभी खरीदें",
  "Checkout": "चेकआउट",
  "Place order": "ऑर्डर दें",
  "My orders": "मेरे ऑर्डर",
  "Track order": "ऑर्डर ट्रैक करें",
  "Thank you": "धन्यवाद",
  "Success": "सफलता",
  "Loading…": "लोड हो रहा है…",
  "Required": "आवश्यक",
  "kg": "किग्रा",
  "per kg": "प्रति किग्रा",
  "Pending": "लंबित",
  "Confirmed": "पुष्ट",
  "Preparing": "तैयारी में",
  "Picked up": "पिकअप हो गया",
  "In transit": "रास्ते में",
  "Delivered": "डिलीवर हो गया",
  "Cancelled": "रद्द",
  "Organic": "जैविक",
  "Vegetables": "सब्जियां",
  "Fruits": "फल",
  "Grains": "अनाज",
  "Pulses": "दालें",
  "Nuts": "मेवे",
  "Spices": "मसाले",
};

const LanguageContext = createContext(null);

function normalize(value) {
  return String(value || "")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function translateText(value, language) {
  if (language !== "hi") return value;
  const normalized = normalize(value);
  if (!normalized) return value;
  if (HI[normalized]) return HI[normalized];

  // Translate known English phrases embedded inside dynamic text while preserving
  // names, numbers, arrows, prices, etc. Example: "Welcome back, Dev".
  let translated = value;
  const entries = Object.entries(HI).sort((a, b) => b[0].length - a[0].length);
  for (const [english, hindi] of entries) {
    if (!english || english.length < 2) continue;
    const pattern = new RegExp(escapeRegExp(english), "g");
    translated = translated.replace(pattern, hindi);
  }
  return translated;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function canTranslateElement(element) {
  if (!element || element.nodeType !== Node.ELEMENT_NODE) return false;
  const tag = element.tagName;
  if (["SCRIPT", "STYLE", "NOSCRIPT", "SVG", "PATH", "CODE", "PRE"].includes(tag)) return false;
  if (element.closest(".language-no-translate")) return false;
  return true;
}

function isInsideEditable(element) {
  return !!element?.closest?.("input, textarea, [contenteditable=\"true\"]");
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      return localStorage.getItem(LANGUAGE_STORAGE_KEY) === "hi" ? "hi" : "en";
    } catch {
      return "en";
    }
  });

  const originals = useRef(new WeakMap());
  const attributeOriginals = useRef(new WeakMap());
  const applying = useRef(false);

  const applyLanguage = useCallback((root, targetLanguage) => {
    if (!root || typeof document === "undefined") return;

    applying.current = true;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) textNodes.push(node);

    for (const textNode of textNodes) {
      const parent = textNode.parentElement;
      if (!canTranslateElement(parent) || isInsideEditable(parent)) continue;

      let original = originals.current.get(textNode);
      if (original === undefined) {
        original = textNode.nodeValue || "";
        originals.current.set(textNode, original);
      }

      const next = targetLanguage === "hi" ? translateText(original, "hi") : original;
      if ((textNode.nodeValue || "") !== next) textNode.nodeValue = next;
    }

    const elements = root.querySelectorAll
      ? root.querySelectorAll("input, textarea, option, [aria-label], [title]")
      : [];

    for (const element of elements) {
      if (!canTranslateElement(element)) continue;
      let record = attributeOriginals.current.get(element);
      if (!record) {
        record = {};
        attributeOriginals.current.set(element, record);
      }

      for (const attr of ["placeholder", "aria-label", "title"]) {
        const current = element.getAttribute(attr);
        if (current == null) continue;
        if (record[attr] === undefined) record[attr] = current;
        const original = record[attr];
        const next = targetLanguage === "hi" ? translateText(original, "hi") : original;
        if (current !== next) element.setAttribute(attr, next);
      }

      // Options are DOM text nodes, but setting selected labels through text nodes is
      // enough; don't overwrite the actual value/code used by React.
    }

    applying.current = false;
  }, []);

  const setLanguage = useCallback((nextLanguage) => {
    const safe = nextLanguage === "hi" ? "hi" : "en";
    setLanguageState(safe);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, safe);
    } catch {
      // Storage can be disabled; the in-memory state still works.
    }
    if (typeof document !== "undefined") {
      document.documentElement.lang = safe === "hi" ? "hi-IN" : "en-IN";
    }
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    document.documentElement.lang = language === "hi" ? "hi-IN" : "en-IN";
    applyLanguage(document.body, language);

    const observer = new MutationObserver((mutations) => {
      if (applying.current) return;
      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((added) => {
            if (added.nodeType === Node.ELEMENT_NODE) applyLanguage(added, language);
            else if (added.nodeType === Node.TEXT_NODE && added.parentElement) applyLanguage(added.parentElement, language);
          });
        } else if (mutation.type === "characterData" && mutation.target.parentElement) {
          applyLanguage(mutation.target.parentElement, language);
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [language, applyLanguage]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    t: (value) => translateText(String(value), language),
    languages: [
      { code: "en", label: "English", nativeLabel: "English" },
      { code: "hi", label: "Hindi", nativeLabel: "हिन्दी" },
    ],
  }), [language, setLanguage]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}
