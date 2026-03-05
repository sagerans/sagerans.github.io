document.addEventListener('DOMContentLoaded', () => {

  const countryFiles = [
    'aa.json',
    'ac.json',
    'ae.json',
    'af.json',
    'ag.json',
    'aj.json',
    'al.json',
    'am.json',
    'an.json',
    'ao.json',
    'aq.json',
    'ar.json',
    'as.json',
    'at.json',
    'au.json',
    'av.json',
    'ax.json',
    'ay.json',
    'ba.json',
    'bb.json',
    'bc.json',
    'bd.json',
    'be.json',
    'bf.json',
    'bg.json',
    'bh.json',
    'bk.json',
    'bl.json',
    'bm.json',
    'bn.json',
    'bo.json',
    'bp.json',
    'bq.json',
    'br.json',
    'bt.json',
    'bu.json',
    'bv.json',
    'bx.json',
    'by.json',
    'ca.json',
    'cb.json',
    'cd.json',
    'ce.json',
    'cf.json',
    'cg.json',
    'ch.json',
    'ci.json',
    'cj.json',
    'ck.json',
    'cm.json',
    'cn.json',
    'co.json',
    'cq.json',
    'cr.json',
    'cs.json',
    'ct.json',
    'cu.json',
    'cv.json',
    'cw.json',
    'cy.json',
    'da.json',
    'dj.json',
    'do.json',
    'dr.json',
    'dx.json',
    'ec.json',
    'ee.json',
    'eg.json',
    'ei.json',
    'ek.json',
    'en.json',
    'er.json',
    'es.json',
    'et.json',
    'ez.json',
    'fi.json',
    'fj.json',
    'fk.json',
    'fm.json',
    'fo.json',
    'fp.json',
    'fr.json',
    'fs.json',
    'ga.json',
    'gb.json',
    'gg.json',
    'gh.json',
    'gi.json',
    'gj.json',
    'gk.json',
    'gl.json',
    'gm.json',
    'gq.json',
    'gr.json',
    'gt.json',
    'gv.json',
    'gy.json',
    'gz.json',
    'ha.json',
    'hk.json',
    'hm.json',
    'ho.json',
    'hr.json',
    'hu.json',
    'ic.json',
    'id.json',
    'im.json',
    'in.json',
    'io.json',
    'ip.json',
    'ir.json',
    'is.json',
    'it.json',
    'iv.json',
    'iz.json',
    'ja.json',
    'je.json',
    'jm.json',
    'jn.json',
    'jo.json',
    'ke.json',
    'kg.json',
    'kn.json',
    'kr.json',
    'ks.json',
    'kt.json',
    'ku.json',
    'kv.json',
    'kz.json',
    'la.json',
    'le.json',
    'lg.json',
    'lh.json',
    'li.json',
    'lo.json',
    'ls.json',
    'lt.json',
    'lu.json',
    'ly.json',
    'ma.json',
    'mc.json',
    'md.json',
    'mg.json',
    'mh.json',
    'mi.json',
    'mj.json',
    'mk.json',
    'ml.json',
    'mn.json',
    'mo.json',
    'mp.json',
    'mr.json',
    'mt.json',
    'mu.json',
    'mv.json',
    'mx.json',
    'my.json',
    'mz.json',
    'nc.json',
    'ne.json',
    'nf.json',
    'ng.json',
    'nh.json',
    'ni.json',
    'nl.json',
    'nn.json',
    'no.json',
    'np.json',
    'nr.json',
    'ns.json',
    'nu.json',
    'nz.json',
    'od.json',
    'pa.json',
    'pc.json',
    'pe.json',
    'pf.json',
    'pg.json',
    'pk.json',
    'pl.json',
    'pm.json',
    'po.json',
    'pp.json',
    'ps.json',
    'pu.json',
    'qa.json',
    'ri.json',
    'rm.json',
    'rn.json',
    'ro.json',
    'rp.json',
    'rq.json',
    'rs.json',
    'rw.json',
    'sa.json',
    'sb.json',
    'sc.json',
    'se.json',
    'sf.json',
    'sg.json',
    'sh.json',
    'si.json',
    'sl.json',
    'sm.json',
    'sn.json',
    'so.json',
    'sp.json',
    'st.json',
    'su.json',
    'sv.json',
    'sw.json',
    'sx.json',
    'sy.json',
    'sz.json',
    'tb.json',
    'td.json',
    'th.json',
    'ti.json',
    'tk.json',
    'tl.json',
    'tn.json',
    'to.json',
    'tp.json',
    'ts.json',
    'tt.json',
    'tu.json',
    'tv.json',
    'tw.json',
    'tx.json',
    'tz.json',
    'uc.json',
    'ug.json',
    'uk.json',
    'um.json',
    'up.json',
    'us.json',
    'uv.json',
    'uy.json',
    'uz.json',
    'vc.json',
    've.json',
    'vi.json',
    'vm.json',
    'vq.json',
    'vt.json',
    'wa.json',
    'we.json',
    'wf.json',
    'wi.json',
    'wq.json',
    'ws.json',
    'wz.json',
    'ym.json',
    'za.json',
    'zi.json'
  ];

  const displayDictionary = [
    "Afghanistan",
    "Akrotiri",
    "Albania",
    "Algeria",
    "American Samoa",
    "Andorra",
    "Angola",
    "Anguilla",
    "Antarctica",
    "Antigua and Barbuda",
    "Arab Republic of Egypt",
    "Argentina",
    "Argentine Republic",
    "Armenia",
    "Aruba",
    "Ashmore and Cartier Islands",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahrain",
    "Bailiwick of Guernsey",
    "Bailiwick of Jersey",
    "Baker Island, Howland Island, Jarvis Island, Johnston Atoll, Kingman Reef, Midway Islands, Palmyra Atoll",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bermuda",
    "Bhutan",
    "Bolivarian Republic of Venezuela",
    "Bolivia",
    "Bosnia and Herzegovina",
    "Botswana",
    "Bouvet Island",
    "Brazil",
    "British Indian Ocean Territory",
    "British Virgin Islands",
    "Brunei",
    "Brunei Darussalam",
    "Bulgaria",
    "Burkina Faso",
    "Burma",
    "Burundi",
    "C&ocirc;te d'Ivoire",
    "Cabo Verde",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Cayman Islands",
    "Central African Republic",
    "Chad",
    "Chile",
    "China",
    "Christmas Island",
    "Clipperton Island",
    "Cocos (Keeling) Islands",
    "Colombia",
    "Commonwealth of Australia",
    "Commonwealth of Dominica",
    "Commonwealth of Puerto Rico",
    "Commonwealth of The Bahamas",
    "Commonwealth of the Northern Mariana Islands",
    "Comoros",
    "Congo (Brazzaville)",
    "Cook Islands",
    "Cooperative Republic of Guyana",
    "Coral Sea Islands",
    "Coral Sea Islands Territory",
    "Costa Rica",
    "Country of Aruba",
    "Country of Curacao",
    "Country of Sint Maarten",
    "Croatia",
    "Cuba",
    "Curacao",
    "Cyprus",
    "Czech Republic",
    "Czechia",
    "DRC",
    "Democratic People's Republic of Korea",
    "Democratic Republic of Sao Tome and Principe",
    "Democratic Republic of Timor-Leste",
    "Democratic Republic of the Congo",
    "Democratic Socialist Republic of Sri Lanka",
    "Denmark",
    "Dhekelia",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Eswatini",
    "Ethiopia",
    "Falkland Islands",
    "Falkland Islands (Islas Malvinas)",
    "Faroe Islands",
    "Federal Democratic Republic of Ethiopia",
    "Federal Republic of Germany",
    "Federal Republic of Nigeria",
    "Federal Republic of Somalia",
    "Federated States of Micronesia",
    "Federation of Saint Kitts and Nevis",
    "Federative Republic of Brazil",
    "Fiji",
    "Finland",
    "France",
    "French Polynesia",
    "French Republic",
    "French Southern and Antarctic Lands",
    "Gabon",
    "Gabonese Republic",
    "Gaza, Gaza Strip",
    "Georgia",
    "Germany",
    "Ghana",
    "Gibraltar",
    "Grand Duchy of Luxembourg",
    "Greece",
    "Greenland",
    "Grenada",
    "Guam",
    "Guatemala",
    "Guernsey",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Hashemite Kingdom of Jordan",
    "Heard Island and McDonald Islands",
    "Hellenic Republic",
    "Holy See (Vatican City)",
    "Honduras",
    "Hong Kong",
    "Hong Kong Special Administrative Region",
    "Hungary",
    "Iceland",
    "Independent State of Papua New Guinea",
    "Independent State of Samoa",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Islamic Republic of Afghanistan (prior to 15 August 2021); current country name disputed",
    "Islamic Republic of Iran",
    "Islamic Republic of Mauritania",
    "Islamic Republic of Pakistan",
    "Isle of Man",
    "Israel",
    "Italian Republic",
    "Italy",
    "Jamaica",
    "Jan Mayen",
    "Japan",
    "Jersey",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kingdom of Bahrain",
    "Kingdom of Belgium",
    "Kingdom of Bhutan",
    "Kingdom of Cambodia",
    "Kingdom of Denmark",
    "Kingdom of Eswatini",
    "Kingdom of Lesotho",
    "Kingdom of Morocco",
    "Kingdom of Norway",
    "Kingdom of Saudi Arabia",
    "Kingdom of Spain",
    "Kingdom of Sweden",
    "Kingdom of Thailand",
    "Kingdom of Tonga",
    "Kingdom of the Netherlands",
    "Kiribati",
    "Kosovo",
    "Kuwait",
    "Kyrgyz Republic",
    "Kyrgyzstan",
    "Lao People's Democratic Republic",
    "Laos",
    "Latvia",
    "Lebanese Republic",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Macau",
    "Macau Special Administrative Region",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Mauritania",
    "Mauritius",
    "Mexico",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Montserrat",
    "Morocco",
    "Mozambique",
    "Namibia",
    "Nauru",
    "Navassa Island",
    "Nepal",
    "Netherlands",
    "New Caledonia",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "Niue",
    "Norfolk Island",
    "North Korea",
    "North Macedonia",
    "Northern Mariana Islands",
    "Norway",
    "Oman",
    "Oriental Republic of Uruguay",
    "Overseas Collectivity of Saint Barthelemy",
    "Overseas Collectivity of Saint Martin",
    "Overseas Lands of French Polynesia",
    "Pakistan",
    "Palau",
    "Panama",
    "Papua New Guinea",
    "Paracel Islands",
    "Paraguay",
    "People's Democratic Republic of Algeria",
    "People's Republic of Bangladesh",
    "People's Republic of China",
    "Peru",
    "Philippines",
    "Pitcairn Islands",
    "Pitcairn, Henderson, Ducie, and Oeno Islands",
    "Plurinational State of Bolivia",
    "Poland",
    "Portugal",
    "Portuguese Republic",
    "Principality of Andorra",
    "Principality of Liechtenstein",
    "Principality of Monaco",
    "Puerto Rico",
    "Qatar",
    "Republic of Albania",
    "Republic of Angola",
    "Republic of Armenia",
    "Republic of Austria",
    "Republic of Azerbaijan",
    "Republic of Belarus",
    "Republic of Benin",
    "Republic of Botswana",
    "Republic of Bulgaria",
    "Republic of Burundi",
    "Republic of C&ocirc;te d'Ivoire",
    "Republic of Cabo Verde",
    "Republic of Cameroon",
    "Republic of Chad",
    "Republic of Chile",
    "Republic of Colombia",
    "Republic of Costa Rica",
    "Republic of Croatia",
    "Republic of Cuba",
    "Republic of Cyprus",
    "Republic of Djibouti",
    "Republic of Ecuador",
    "Republic of El Salvador",
    "Republic of Equatorial Guinea",
    "Republic of Estonia",
    "Republic of Fiji",
    "Republic of Finland",
    "Republic of Ghana",
    "Republic of Guatemala",
    "Republic of Guinea",
    "Republic of Guinea-Bissau",
    "Republic of Haiti",
    "Republic of Honduras",
    "Republic of India",
    "Republic of Indonesia",
    "Republic of Iraq",
    "Republic of Kazakhstan",
    "Republic of Kenya",
    "Republic of Kiribati",
    "Republic of Korea",
    "Republic of Kosovo",
    "Republic of Latvia",
    "Republic of Liberia",
    "Republic of Lithuania",
    "Republic of Madagascar",
    "Republic of Malawi",
    "Republic of Maldives",
    "Republic of Mali",
    "Republic of Malta",
    "Republic of Mauritius",
    "Republic of Moldova",
    "Republic of Mozambique",
    "Republic of Namibia",
    "Republic of Nauru",
    "Republic of Nicaragua",
    "Republic of Niger",
    "Republic of North Macedonia",
    "Republic of Palau",
    "Republic of Panama",
    "Republic of Paraguay",
    "Republic of Peru",
    "Republic of Poland",
    "Republic of Rwanda",
    "Republic of San Marino",
    "Republic of Senegal",
    "Republic of Serbia",
    "Republic of Seychelles",
    "Republic of Sierra Leone",
    "Republic of Singapore",
    "Republic of Slovenia",
    "Republic of South Africa",
    "Republic of South Sudan",
    "Republic of Suriname",
    "Republic of Tajikistan",
    "Republic of The Gambia",
    "Republic of Trinidad and Tobago",
    "Republic of Tunisia",
    "Republic of Turkey",
    "Republic of Uganda",
    "Republic of Uzbekistan",
    "Republic of Vanuatu",
    "Republic of Yemen",
    "Republic of Zambia",
    "Republic of Zimbabwe",
    "Republic of the Congo",
    "Republic of the Marshall Islands",
    "Republic of the Philippines",
    "Republic of the Sudan",
    "Romania",
    "Russia",
    "Russian Federation",
    "Rwanda",
    "Saint Barthelemy",
    "Saint Helena, Ascension, and Tristan da Cunha",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Martin",
    "Saint Pierre and Miquelon",
    "Saint Vincent and the Grenadines",
    "Samoa",
    "San Marino",
    "Sao Tome and Principe",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Sint Maarten",
    "Slovak Republic",
    "Slovakia",
    "Slovenia",
    "Socialist Republic of Vietnam",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Georgia and South Sandwich Islands",
    "South Georgia and the South Sandwich Islands",
    "South Korea",
    "South Sudan",
    "Spain",
    "Spratly Islands",
    "Sri Lanka",
    "State of Eritrea",
    "State of Israel",
    "State of Kuwait",
    "State of Libya",
    "State of Qatar",
    "Sudan",
    "Sultanate of Oman",
    "Suriname",
    "Svalbard (Spitsbergen)",
    "Sweden",
    "Swiss Confederation",
    "Switzerland",
    "Syria",
    "Syrian Arab Republic",
    "Taiwan",
    "Tajikistan",
    "Tanzania",
    "Territorial Collectivity of Saint Pierre and Miquelon",
    "Territory of Ashmore and Cartier Islands",
    "Territory of Christmas Island",
    "Territory of Cocos (Keeling) Islands",
    "Territory of Heard Island and McDonald Islands",
    "Territory of New Caledonia and Dependencies",
    "Territory of Norfolk Island",
    "Territory of the French Southern and Antarctic Lands",
    "Territory of the Wallis and Futuna Islands",
    "Thailand",
    "The Bahamas",
    "The Dominican",
    "The Gambia",
    "The Holy See (Vatican City State)",
    "Timor-Leste",
    "Togo",
    "Togolese Republic",
    "Tokelau",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Turks and Caicos Islands",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "Union of Burma",
    "Union of the Comoros",
    "United Arab Emirates",
    "United Kingdom",
    "United Kingdom of Great Britain and Northern Ireland",
    "United Mexican States",
    "United Republic of Tanzania",
    "United States",
    "United States of America",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Venezuela",
    "Vietnam",
    "Virgin Islands",
    "Wake Island",
    "Wallis and Futuna",
    "West Bank",
    "Western Sahara",
    "Yemen",
    "Zambia",
    "Zimbabwe"
  ];

  const countryAliasMap = {
    "aruba": "aruba",
    "countryofaruba": "aruba",
    "landarubadutchpaisarubapapiamento": "aruba",
    "arubandutch": "aruba",
    "antiguaandbarbuda": "antiguaandbarbuda",
    "antiguanbarbudan": "antiguaandbarbuda",
    "unitedarabemirates": "unitedarabemirates",
    "alimaratalarabiyahalmuttahidah": "unitedarabemirates",
    "emirati": "unitedarabemirates",
    "afghanistan": "afghanistan",
    "islamicrepublicofafghanistanpriortoaugustcurrentcountrynamedisputed": "afghanistan",
    "jamhuriyeislamiyeafghanistanpriortoaugustcurrentcountrynameisdisputed": "afghanistan",
    "afghan": "afghanistan",
    "algeria": "algeria",
    "peoplesdemocraticrepublicofalgeria": "algeria",
    "aljazair": "algeria",
    "aljumhuriyahaljazairiyahaddimuqratiyahashshabiyah": "algeria",
    "algerian": "algeria",
    "azerbaijan": "azerbaijan",
    "republicofazerbaijan": "azerbaijan",
    "azarbaycan": "azerbaijan",
    "azarbaycanrespublikasi": "azerbaijan",
    "azerbaijani": "azerbaijan",
    "albania": "albania",
    "republicofalbania": "albania",
    "shqiperia": "albania",
    "republikaeshqiperise": "albania",
    "albanian": "albania",
    "armenia": "armenia",
    "republicofarmenia": "armenia",
    "hayastan": "armenia",
    "hayastanihanrapetutyun": "armenia",
    "armenian": "armenia",
    "andorra": "andorra",
    "principalityofandorra": "andorra",
    "principatdandorra": "andorra",
    "andorran": "andorra",
    "angola": "angola",
    "republicofangola": "angola",
    "republicadeangola": "angola",
    "angolan": "angola",
    "americansamoa": "americansamoa",
    "americansamoan": "americansamoa",
    "argentina": "argentina",
    "argentinerepublic": "argentina",
    "repuacuteblicaargentina": "argentina",
    "argentine": "argentina",
    "australia": "australia",
    "commonwealthofaustralia": "australia",
    "australian": "australia",
    "ashmoreandcartierislands": "ashmoreandcartierislands",
    "territoryofashmoreandcartierislands": "ashmoreandcartierislands",
    "austria": "austria",
    "republicofaustria": "austria",
    "oesterreich": "austria",
    "republikoesterreich": "austria",
    "austrian": "austria",
    "anguilla": "anguilla",
    "anguillan": "anguilla",
    "akrotiri": "akrotiri",
    "antarctica": "antarctica",
    "bahrain": "bahrain",
    "kingdomofbahrain": "bahrain",
    "albahrayn": "bahrain",
    "mamlakatalbahrayn": "bahrain",
    "bahraini": "bahrain",
    "barbados": "barbados",
    "barbadianorbajancolloquial": "barbados",
    "botswana": "botswana",
    "republicofbotswana": "botswana",
    "motswanasingularbatswanaplural": "botswana",
    "bermuda": "bermuda",
    "bermudian": "bermuda",
    "belgium": "belgium",
    "kingdomofbelgium": "belgium",
    "belgiquebelgiebelgien": "belgium",
    "royaumedebelgiquefrenchkoninkrijkbelgiedutchkoenigreichbelgiengerman": "belgium",
    "belgian": "belgium",
    "thebahamas": "thebahamas",
    "commonwealthofthebahamas": "thebahamas",
    "bahamian": "thebahamas",
    "bangladesh": "bangladesh",
    "peoplesrepublicofbangladesh": "bangladesh",
    "ganaprajatantribangladesh": "bangladesh",
    "bangladeshi": "bangladesh",
    "belize": "belize",
    "belizean": "belize",
    "bosniaandherzegovina": "bosniaandherzegovina",
    "bosnaihercegovina": "bosniaandherzegovina",
    "bosnianherzegovinian": "bosniaandherzegovina",
    "bolivia": "bolivia",
    "plurinationalstateofbolivia": "bolivia",
    "estadoplurinacionaldebolivia": "bolivia",
    "bolivian": "bolivia",
    "myanmar": "burma",
    "burma": "burma",
    "unionofburma": "burma",
    "myanmanaingngandaw": "burma",
    "pyidaungzuthammadamyanmanaingngandaw": "burma",
    "burmese": "burma",
    "benin": "benin",
    "republicofbenin": "benin",
    "reacutepubliquedubenin": "benin",
    "beninese": "benin",
    "belarus": "belarus",
    "republicofbelarus": "belarus",
    "byelarusbelarusianbelarusrussian": "belarus",
    "respublikabyelarusbelarusianrespublikabelarusrussian": "belarus",
    "belarusian": "belarus",
    "solomonislands": "solomonislands",
    "solomonislander": "solomonislands",
    "navassaisland": "navassaisland",
    "brazil": "brazil",
    "federativerepublicofbrazil": "brazil",
    "brasil": "brazil",
    "repuacuteblicafederativadobrasil": "brazil",
    "brazilian": "brazil",
    "bhutan": "bhutan",
    "kingdomofbhutan": "bhutan",
    "drukyul": "bhutan",
    "drukgyalkhap": "bhutan",
    "bhutanese": "bhutan",
    "bulgaria": "bulgaria",
    "republicofbulgaria": "bulgaria",
    "republikabulgaria": "bulgaria",
    "bulgarian": "bulgaria",
    "bouvetisland": "bouvetisland",
    "brunei": "brunei",
    "bruneidarussalam": "brunei",
    "negarabruneidarussalam": "brunei",
    "bruneian": "brunei",
    "burundi": "burundi",
    "republicofburundi": "burundi",
    "reacutepubliqueduburundifrenchrepublikayuburundikirundi": "burundi",
    "burundian": "burundi",
    "canada": "canada",
    "canadian": "canada",
    "cambodia": "cambodia",
    "kingdomofcambodia": "cambodia",
    "kampuchea": "cambodia",
    "preahreacheanachakrkampucheaphonetictransliteration": "cambodia",
    "cambodian": "cambodia",
    "chad": "chad",
    "republicofchad": "chad",
    "tchadtshad": "chad",
    "reacutepubliquedutchadjumhuriyattshad": "chad",
    "chadian": "chad",
    "srilanka": "srilanka",
    "democraticsocialistrepublicofsrilanka": "srilanka",
    "shrilankasinhalailankaitamil": "srilanka",
    "shrilankaprajatantrikasamajavadijanarajayasinhalailankaijananayakachoshalichakkutiyarachutamil": "srilanka",
    "srilankan": "srilanka",
    "congobrazzaville": "congobrazzaville",
    "republicofthecongo": "congobrazzaville",
    "congo": "congobrazzaville",
    "reacutepubliqueducongo": "congobrazzaville",
    "congoleseorcongo": "drc",
    "drc": "drc",
    "democraticrepublicofthecongo": "drc",
    "rdc": "drc",
    "reacutepubliquedeacutemocratiqueducongo": "drc",
    "china": "china",
    "peoplesrepublicofchina": "china",
    "zhongguo": "china",
    "zhonghuarenmingongheguo": "china",
    "chinese": "macau",
    "chile": "chile",
    "republicofchile": "chile",
    "repuacuteblicadechile": "chile",
    "chilean": "chile",
    "caymanislands": "caymanislands",
    "caymanian": "caymanislands",
    "cocoskeelingislands": "cocoskeelingislands",
    "territoryofcocoskeelingislands": "cocoskeelingislands",
    "cocosislander": "cocoskeelingislands",
    "cameroon": "cameroon",
    "republicofcameroon": "cameroon",
    "camerouncameroon": "cameroon",
    "reacutepubliqueducamerounfrenchrepublicofcameroonenglish": "cameroon",
    "cameroonian": "cameroon",
    "comoros": "comoros",
    "unionofthecomoros": "comoros",
    "komoricomorianlescomoresfrenchjuzuralqamararabic": "comoros",
    "udzimawakomoricomorianuniondescomoresfrenchalittihadalqumuriarabic": "comoros",
    "comoran": "comoros",
    "colombia": "colombia",
    "republicofcolombia": "colombia",
    "repuacuteblicadecolombia": "colombia",
    "colombian": "colombia",
    "northernmarianaislands": "northernmarianaislands",
    "commonwealthofthenorthernmarianaislands": "northernmarianaislands",
    "na": "northernmarianaislands",
    "coralseaislands": "coralseaislands",
    "coralseaislandsterritory": "coralseaislands",
    "costarica": "costarica",
    "republicofcostarica": "costarica",
    "repuacuteblicadecostarica": "costarica",
    "costarican": "costarica",
    "centralafricanrepublic": "centralafricanrepublic",
    "reacutepubliquecentrafricaine": "centralafricanrepublic",
    "centralafrican": "centralafricanrepublic",
    "cuba": "cuba",
    "republicofcuba": "cuba",
    "repuacuteblicadecuba": "cuba",
    "cuban": "cuba",
    "caboverde": "caboverde",
    "republicofcaboverde": "caboverde",
    "republicadecaboverde": "caboverde",
    "caboverdean": "caboverde",
    "cookislands": "cookislands",
    "cookislander": "cookislands",
    "cyprus": "cyprus",
    "republicofcyprus": "cyprus",
    "kyprosgreekkibristurkish": "cyprus",
    "kypriakidimokratiagreekkibriscumhuriyetiturkish": "cyprus",
    "cypriot": "cyprus",
    "denmark": "denmark",
    "kingdomofdenmark": "denmark",
    "danmark": "denmark",
    "kongerigetdanmark": "denmark",
    "danish": "denmark",
    "djibouti": "djibouti",
    "republicofdjibouti": "djibouti",
    "djiboutifrenchjibutiarabic": "djibouti",
    "reacutepubliquededjiboutifrenchjumhuriyatjibutiarabic": "djibouti",
    "djiboutian": "djibouti",
    "dominica": "dominica",
    "commonwealthofdominica": "dominica",
    "dominican": "thedominican",
    "thedominican": "thedominican",
    "dominicanrepublic": "thedominican",
    "ladominicana": "thedominican",
    "repuacuteblicadominicana": "thedominican",
    "dhekelia": "dhekelia",
    "ecuador": "ecuador",
    "republicofecuador": "ecuador",
    "repuacuteblicadelecuador": "ecuador",
    "ecuadorian": "ecuador",
    "egypt": "egypt",
    "arabrepublicofegypt": "egypt",
    "misr": "egypt",
    "jumhuriyatmisralarabiyah": "egypt",
    "egyptian": "egypt",
    "ireland": "ireland",
    "eire": "ireland",
    "irish": "ireland",
    "equatorialguinea": "equatorialguinea",
    "republicofequatorialguinea": "equatorialguinea",
    "guineaecuatorialspanishguineacuteeeacutequatorialefrench": "equatorialguinea",
    "republicadeguineaecuatorialspanishreacutepubliquedeguineacuteeeacutequatorialefrench": "equatorialguinea",
    "equatorialguineanorequatoguinean": "equatorialguinea",
    "estonia": "estonia",
    "republicofestonia": "estonia",
    "eesti": "estonia",
    "eestivabariik": "estonia",
    "estonian": "estonia",
    "eritrea": "eritrea",
    "stateoferitrea": "eritrea",
    "ertra": "eritrea",
    "hagereertra": "eritrea",
    "eritrean": "eritrea",
    "elsalvador": "elsalvador",
    "republicofelsalvador": "elsalvador",
    "repuacuteblicadeelsalvador": "elsalvador",
    "salvadoran": "elsalvador",
    "ethiopia": "ethiopia",
    "federaldemocraticrepublicofethiopia": "ethiopia",
    "ityopiya": "ethiopia",
    "yeityopiyafederalawidemokrasiyawiripeblik": "ethiopia",
    "ethiopian": "ethiopia",
    "czechia": "czechia",
    "czechrepublic": "czechia",
    "cesko": "czechia",
    "ceskarepublika": "czechia",
    "czech": "czechia",
    "finland": "finland",
    "republicoffinland": "finland",
    "suomifinnishfinlandswedish": "finland",
    "suomentasavaltafinnishrepublikenfinlandswedish": "finland",
    "finnish": "finland",
    "fiji": "fiji",
    "republicoffiji": "fiji",
    "fijienglishvitifijian": "fiji",
    "republicoffijienglishmatanitukovitifijian": "fiji",
    "fijian": "fiji",
    "falklandislands": "falklandislands",
    "falklandislandsislasmalvinas": "falklandislands",
    "falklandisland": "falklandislands",
    "federatedstatesofmicronesia": "federatedstatesofmicronesia",
    "micronesianchuukesekosraenspohnpeiansyapese": "federatedstatesofmicronesia",
    "faroeislands": "faroeislands",
    "foroyar": "faroeislands",
    "faroese": "faroeislands",
    "frenchpolynesia": "frenchpolynesia",
    "overseaslandsoffrenchpolynesia": "frenchpolynesia",
    "polyneacutesiefranccedilaise": "frenchpolynesia",
    "paysdoutremerdelapolyneacutesiefranccedilaise": "frenchpolynesia",
    "frenchpolynesian": "frenchpolynesia",
    "france": "france",
    "frenchrepublic": "france",
    "reacutepubliquefranccedilaise": "france",
    "french": "saintpierreandmiquelon",
    "frenchsouthernandantarcticlands": "frenchsouthernandantarcticlands",
    "territoryofthefrenchsouthernandantarcticlands": "frenchsouthernandantarcticlands",
    "terresaustralesetantarctiquesfranccedilaises": "frenchsouthernandantarcticlands",
    "thegambia": "thegambia",
    "republicofthegambia": "thegambia",
    "gambian": "thegambia",
    "gabon": "gabon",
    "gaboneserepublic": "gabon",
    "reacutepubliquegabonaise": "gabon",
    "gabonese": "gabon",
    "georgia": "georgia",
    "sakartvelo": "georgia",
    "republicofgeorgia": "georgia",
    "georgian": "georgia",
    "ghana": "ghana",
    "republicofghana": "ghana",
    "ghanaian": "ghana",
    "gibraltar": "gibraltar",
    "grenada": "grenada",
    "grenadian": "grenada",
    "guernsey": "guernsey",
    "bailiwickofguernsey": "guernsey",
    "channelislander": "jersey",
    "greenland": "greenland",
    "kalaallitnunaat": "greenland",
    "greenlandic": "greenland",
    "germany": "germany",
    "federalrepublicofgermany": "germany",
    "deutschland": "germany",
    "bundesrepublikdeutschland": "germany",
    "german": "germany",
    "guam": "guam",
    "guahan": "guam",
    "guamanian": "guam",
    "greece": "greece",
    "hellenicrepublic": "greece",
    "ellasorellada": "greece",
    "ellinikidimokratia": "greece",
    "greek": "greece",
    "guatemala": "guatemala",
    "republicofguatemala": "guatemala",
    "repuacuteblicadeguatemala": "guatemala",
    "guatemalan": "guatemala",
    "guinea": "guinea",
    "republicofguinea": "guinea",
    "guineacutee": "guinea",
    "reacutepubliquedeguineacutee": "guinea",
    "guinean": "guinea",
    "guyana": "guyana",
    "cooperativerepublicofguyana": "guyana",
    "guyanese": "guyana",
    "gazagazastrip": "gazagazastrip",
    "qitaghazzah": "gazagazastrip",
    "haiti": "haiti",
    "republicofhaiti": "haiti",
    "haiumltifrenchayitihaitiancreole": "haiti",
    "reacutepubliquedhaiumltifrenchrepiblikdayitihaitiancreole": "haiti",
    "haitian": "haiti",
    "hongkong": "hongkong",
    "hongkongspecialadministrativeregion": "hongkong",
    "heungkongeiteldyerball": "hongkong",
    "heungkongtakpithangchingkueiteldyerball": "hongkong",
    "chinesehongkong": "hongkong",
    "heardislandandmcdonaldislands": "heardislandandmcdonaldislands",
    "territoryofheardislandandmcdonaldislands": "heardislandandmcdonaldislands",
    "honduras": "honduras",
    "republicofhonduras": "honduras",
    "repuacuteblicadehonduras": "honduras",
    "honduran": "honduras",
    "croatia": "croatia",
    "republicofcroatia": "croatia",
    "hrvatska": "croatia",
    "republikahrvatska": "croatia",
    "croatian": "croatia",
    "hungary": "hungary",
    "magyarorszag": "hungary",
    "hungarian": "hungary",
    "iceland": "iceland",
    "island": "iceland",
    "icelandic": "iceland",
    "indonesia": "indonesia",
    "republicofindonesia": "indonesia",
    "republikindonesia": "indonesia",
    "indonesian": "indonesia",
    "isleofman": "isleofman",
    "ellanvannin": "isleofman",
    "manx": "isleofman",
    "india": "india",
    "republicofindia": "india",
    "indiaenglishbharathindi": "india",
    "republicofindiaenglishbharatiyaganarajyahindi": "india",
    "indian": "india",
    "britishindianoceanterritory": "britishindianoceanterritory",
    "clippertonisland": "clippertonisland",
    "ileclipperton": "clippertonisland",
    "iran": "iran",
    "islamicrepublicofiran": "iran",
    "jomhuriyeeslamiyeiran": "iran",
    "iranian": "iran",
    "israel": "israel",
    "stateofisrael": "israel",
    "yisrael": "israel",
    "medinatyisrael": "israel",
    "israeli": "israel",
    "italy": "italy",
    "italianrepublic": "italy",
    "italia": "italy",
    "repubblicaitaliana": "italy",
    "italian": "italy",
    "cocirctedivoire": "cocirctedivoire",
    "republicofcocirctedivoire": "cocirctedivoire",
    "cotedivoire": "cocirctedivoire",
    "reacutepubliquedecocirctedivoire": "cocirctedivoire",
    "ivoirian": "cocirctedivoire",
    "iraq": "iraq",
    "republicofiraq": "iraq",
    "aliraqeraq": "iraq",
    "jumhuriyataliraqkomarieraq": "iraq",
    "iraqi": "iraq",
    "japan": "japan",
    "nihonnippon": "japan",
    "nihonkokunipponkoku": "japan",
    "japanese": "japan",
    "jersey": "jersey",
    "bailiwickofjersey": "jersey",
    "jamaica": "jamaica",
    "jamaican": "jamaica",
    "janmayen": "janmayen",
    "jordan": "jordan",
    "hashemitekingdomofjordan": "jordan",
    "alurdun": "jordan",
    "almamlakahalurduniyahalhashimiyah": "jordan",
    "jordanian": "jordan",
    "kenya": "kenya",
    "republicofkenya": "kenya",
    "republicofkenyaenglishjamhuriyakenyaswahili": "kenya",
    "kenyan": "kenya",
    "kyrgyzstan": "kyrgyzstan",
    "kyrgyzrepublic": "kyrgyzstan",
    "kyrgyzrespublikasy": "kyrgyzstan",
    "kyrgyzstani": "kyrgyzstan",
    "northkorea": "northkorea",
    "democraticpeoplesrepublicofkorea": "northkorea",
    "choson": "northkorea",
    "chosonminjujuuiinminkonghwaguk": "northkorea",
    "korean": "southkorea",
    "kiribati": "kiribati",
    "republicofkiribati": "kiribati",
    "southkorea": "southkorea",
    "republicofkorea": "southkorea",
    "hanguk": "southkorea",
    "taehanminguk": "southkorea",
    "christmasisland": "christmasisland",
    "territoryofchristmasisland": "christmasisland",
    "kuwait": "kuwait",
    "stateofkuwait": "kuwait",
    "alkuwayt": "kuwait",
    "dawlatalkuwayt": "kuwait",
    "kuwaiti": "kuwait",
    "kosovo": "kosovo",
    "republicofkosovo": "kosovo",
    "kosovealbaniankosovoserbian": "kosovo",
    "republikaekosovesalbanianrepublikakosovoserbian": "kosovo",
    "kosovan": "kosovo",
    "kazakhstan": "kazakhstan",
    "republicofkazakhstan": "kazakhstan",
    "qazaqstan": "kazakhstan",
    "qazaqstanrespublikasy": "kazakhstan",
    "kazakhstani": "kazakhstan",
    "laos": "laos",
    "laopeoplesdemocraticrepublic": "laos",
    "mueanglaounofficial": "laos",
    "sathalanalatpaxathipataipaxaxonlao": "laos",
    "laoorlaotian": "laos",
    "lebanon": "lebanon",
    "lebaneserepublic": "lebanon",
    "lubnan": "lebanon",
    "aljumhuriyahallubnaniyah": "lebanon",
    "lebanese": "lebanon",
    "latvia": "latvia",
    "republicoflatvia": "latvia",
    "latvija": "latvia",
    "latvijasrepublika": "latvia",
    "latvian": "latvia",
    "lithuania": "lithuania",
    "republicoflithuania": "lithuania",
    "lietuva": "lithuania",
    "lietuvosrespublika": "lithuania",
    "lithuanian": "lithuania",
    "liberia": "liberia",
    "republicofliberia": "liberia",
    "liberian": "liberia",
    "slovakia": "slovakia",
    "slovakrepublic": "slovakia",
    "slovensko": "slovakia",
    "slovenskarepublika": "slovakia",
    "slovak": "slovakia",
    "liechtenstein": "liechtenstein",
    "principalityofliechtenstein": "liechtenstein",
    "fuerstentumliechtenstein": "liechtenstein",
    "lesotho": "lesotho",
    "kingdomoflesotho": "lesotho",
    "basotho": "lesotho",
    "luxembourg": "luxembourg",
    "grandduchyofluxembourg": "luxembourg",
    "grandducheacutedeluxembourg": "luxembourg",
    "libya": "libya",
    "stateoflibya": "libya",
    "libiya": "libya",
    "dawlatlibiya": "libya",
    "libyan": "libya",
    "madagascar": "madagascar",
    "republicofmadagascar": "madagascar",
    "madagascarmadagasikara": "madagascar",
    "reacutepubliquedemadagascarrepoblikanimadagasikara": "madagascar",
    "malagasy": "madagascar",
    "macau": "macau",
    "macauspecialadministrativeregion": "macau",
    "moldova": "moldova",
    "republicofmoldova": "moldova",
    "republicamoldova": "moldova",
    "moldovan": "moldova",
    "mongolia": "mongolia",
    "mongoluls": "mongolia",
    "mongolian": "mongolia",
    "montserrat": "montserrat",
    "montserratian": "montserrat",
    "malawi": "malawi",
    "republicofmalawi": "malawi",
    "dzikolamalawi": "malawi",
    "malawian": "malawi",
    "montenegro": "montenegro",
    "crnagora": "montenegro",
    "montenegrin": "montenegro",
    "northmacedonia": "northmacedonia",
    "republicofnorthmacedonia": "northmacedonia",
    "severnamakedonija": "northmacedonia",
    "republikasevernamakedonija": "northmacedonia",
    "macedonian": "northmacedonia",
    "mali": "mali",
    "republicofmali": "mali",
    "reacutepubliquedemali": "mali",
    "malian": "mali",
    "monaco": "monaco",
    "principalityofmonaco": "monaco",
    "principauteacutedemonaco": "monaco",
    "monegasqueormonacan": "monaco",
    "morocco": "morocco",
    "kingdomofmorocco": "morocco",
    "almaghrib": "morocco",
    "almamlakahalmaghribiyah": "morocco",
    "moroccan": "morocco",
    "mauritius": "mauritius",
    "republicofmauritius": "mauritius",
    "mauritian": "mauritius",
    "mauritania": "mauritania",
    "islamicrepublicofmauritania": "mauritania",
    "muritaniyah": "mauritania",
    "aljumhuriyahalislamiyahalmuritaniyah": "mauritania",
    "mauritanian": "mauritania",
    "malta": "malta",
    "republicofmalta": "malta",
    "repubblikatamalta": "malta",
    "maltese": "malta",
    "oman": "oman",
    "sultanateofoman": "oman",
    "uman": "oman",
    "saltanatuman": "oman",
    "omani": "oman",
    "maldives": "maldives",
    "republicofmaldives": "maldives",
    "dhivehiraajje": "maldives",
    "dhivehiraajjeygejumhooriyyaa": "maldives",
    "maldivian": "maldives",
    "mexico": "mexico",
    "unitedmexicanstates": "mexico",
    "estadosunidosmexicanos": "mexico",
    "mexican": "mexico",
    "malaysia": "malaysia",
    "malaysian": "malaysia",
    "mozambique": "mozambique",
    "republicofmozambique": "mozambique",
    "mocambique": "mozambique",
    "republicademocambique": "mozambique",
    "mozambican": "mozambique",
    "newcaledonia": "newcaledonia",
    "territoryofnewcaledoniaanddependencies": "newcaledonia",
    "nouvellecaleacutedonie": "newcaledonia",
    "territoiredesnouvellecaleacutedonieetdeacutependances": "newcaledonia",
    "newcaledonian": "newcaledonia",
    "niue": "niue",
    "niuean": "niue",
    "norfolkisland": "norfolkisland",
    "territoryofnorfolkisland": "norfolkisland",
    "norfolkislanders": "norfolkisland",
    "niger": "niger",
    "republicofniger": "niger",
    "reacutepubliqueduniger": "niger",
    "nigerien": "niger",
    "vanuatu": "vanuatu",
    "republicofvanuatu": "vanuatu",
    "ripablikblongvanuatu": "vanuatu",
    "nivanuatu": "vanuatu",
    "nigeria": "nigeria",
    "federalrepublicofnigeria": "nigeria",
    "nigerian": "nigeria",
    "netherlands": "netherlands",
    "kingdomofthenetherlands": "netherlands",
    "nederland": "netherlands",
    "koninkrijkdernederlanden": "netherlands",
    "dutch": "netherlands",
    "sintmaarten": "sintmaarten",
    "countryofsintmaarten": "sintmaarten",
    "sintmaartendutchandenglish": "sintmaarten",
    "landsintmaartendutchcountryofsintmaartenenglish": "sintmaarten",
    "norway": "norway",
    "kingdomofnorway": "norway",
    "norge": "norway",
    "kongeriketnorge": "norway",
    "norwegian": "norway",
    "nepal": "nepal",
    "nepali": "nepal",
    "nauru": "nauru",
    "republicofnauru": "nauru",
    "nauruan": "nauru",
    "suriname": "suriname",
    "republicofsuriname": "suriname",
    "republieksuriname": "suriname",
    "surinamese": "suriname",
    "nicaragua": "nicaragua",
    "republicofnicaragua": "nicaragua",
    "repuacuteblicadenicaragua": "nicaragua",
    "nicaraguan": "nicaragua",
    "newzealand": "newzealand",
    "southsudan": "southsudan",
    "republicofsouthsudan": "southsudan",
    "southsudanese": "southsudan",
    "paraguay": "paraguay",
    "republicofparaguay": "paraguay",
    "repuacuteblicadelparaguay": "paraguay",
    "paraguayan": "paraguay",
    "pitcairnislands": "pitcairnislands",
    "pitcairnhendersonducieandoenoislands": "pitcairnislands",
    "pitcairnislander": "pitcairnislands",
    "peru": "peru",
    "republicofperu": "peru",
    "peruacute": "peru",
    "repuacuteblicadelperuacute": "peru",
    "peruvian": "peru",
    "paracelislands": "paracelislands",
    "spratlyislands": "spratlyislands",
    "pakistan": "pakistan",
    "islamicrepublicofpakistan": "pakistan",
    "jamhuryatislamipakistan": "pakistan",
    "pakistani": "pakistan",
    "poland": "poland",
    "republicofpoland": "poland",
    "polska": "poland",
    "rzeczpospolitapolska": "poland",
    "polish": "poland",
    "panama": "panama",
    "republicofpanama": "panama",
    "repuacuteblicadepanama": "panama",
    "panamanian": "panama",
    "portugal": "portugal",
    "portugueserepublic": "portugal",
    "republicaportuguesa": "portugal",
    "portuguese": "portugal",
    "papuanewguinea": "papuanewguinea",
    "independentstateofpapuanewguinea": "papuanewguinea",
    "papuaniugini": "papuanewguinea",
    "papuanewguinean": "papuanewguinea",
    "palau": "palau",
    "republicofpalau": "palau",
    "belau": "palau",
    "beluuerabelau": "palau",
    "palauan": "palau",
    "guineabissau": "guineabissau",
    "republicofguineabissau": "guineabissau",
    "guinebissau": "guineabissau",
    "republicadaguinebissau": "guineabissau",
    "bissauguinean": "guineabissau",
    "qatar": "qatar",
    "stateofqatar": "qatar",
    "dawlatqatar": "qatar",
    "qatari": "qatar",
    "serbia": "serbia",
    "republicofserbia": "serbia",
    "srbija": "serbia",
    "republikasrbija": "serbia",
    "serbian": "serbia",
    "marshallislands": "marshallislands",
    "republicofthemarshallislands": "marshallislands",
    "marshallese": "marshallislands",
    "saintmartin": "saintmartin",
    "overseascollectivityofsaintmartin": "saintmartin",
    "collectiviteacutedoutremerdesaintmartin": "saintmartin",
    "romania": "romania",
    "romanian": "romania",
    "philippines": "philippines",
    "republicofthephilippines": "philippines",
    "pilipinas": "philippines",
    "republikangpilipinas": "philippines",
    "philippine": "philippines",
    "puertorico": "puertorico",
    "commonwealthofpuertorico": "puertorico",
    "puertorican": "puertorico",
    "russia": "russia",
    "russianfederation": "russia",
    "rossiya": "russia",
    "rossiyskayafederatsiya": "russia",
    "russian": "russia",
    "rwanda": "rwanda",
    "republicofrwanda": "rwanda",
    "republikayurwanda": "rwanda",
    "rwandan": "rwanda",
    "saudiarabia": "saudiarabia",
    "kingdomofsaudiarabia": "saudiarabia",
    "alarabiyahassuudiyah": "saudiarabia",
    "almamlakahalarabiyahassuudiyah": "saudiarabia",
    "saudiorsaudiarabian": "saudiarabia",
    "saintpierreandmiquelon": "saintpierreandmiquelon",
    "territorialcollectivityofsaintpierreandmiquelon": "saintpierreandmiquelon",
    "saintpierreetmiquelon": "saintpierreandmiquelon",
    "deacutepartementdesaintpierreetmiquelon": "saintpierreandmiquelon",
    "saintkittsandnevis": "saintkittsandnevis",
    "federationofsaintkittsandnevis": "saintkittsandnevis",
    "kittitiannevisian": "saintkittsandnevis",
    "seychelles": "seychelles",
    "republicofseychelles": "seychelles",
    "seychellois": "seychelles",
    "southafrica": "southafrica",
    "republicofsouthafrica": "southafrica",
    "southafrican": "southafrica",
    "senegal": "senegal",
    "republicofsenegal": "senegal",
    "seacuteneacutegal": "senegal",
    "reacutepubliqueduseacuteneacutegal": "senegal",
    "senegalese": "senegal",
    "sainthelenaascensionandtristandacunha": "sainthelenaascensionandtristandacunha",
    "sainthelenian": "sainthelenaascensionandtristandacunha",
    "slovenia": "slovenia",
    "republicofslovenia": "slovenia",
    "slovenija": "slovenia",
    "republikaslovenija": "slovenia",
    "slovenian": "slovenia",
    "sierraleone": "sierraleone",
    "republicofsierraleone": "sierraleone",
    "sierraleonean": "sierraleone",
    "sanmarino": "sanmarino",
    "republicofsanmarino": "sanmarino",
    "repubblicadisanmarino": "sanmarino",
    "sammarinese": "sanmarino",
    "singapore": "singapore",
    "republicofsingapore": "singapore",
    "somalia": "somalia",
    "federalrepublicofsomalia": "somalia",
    "soomaaliyasomaliassumalarabic": "somalia",
    "jamhuuriyaddafederaalkasoomaaliyasomalijumhuriyatassumalalfidiraliyaharabic": "somalia",
    "somali": "somalia",
    "spain": "spain",
    "kingdomofspain": "spain",
    "espantildea": "spain",
    "reinodeespantildea": "spain",
    "spanish": "spain",
    "saintlucia": "saintlucia",
    "saintlucian": "saintlucia",
    "sudan": "sudan",
    "republicofthesudan": "sudan",
    "assudan": "sudan",
    "jumhuriyatassudan": "sudan",
    "sudanese": "sudan",
    "svalbardsspitsbergen": "svalbardsometimesreferredtoasspitsbergenthelargestislandinthearchipelago",
    "svalbard": "svalbardsometimesreferredtoasspitsbergenthelargestislandinthearchipelago",
    "sweden": "sweden",
    "kingdomofsweden": "sweden",
    "sverige": "sweden",
    "konungariketsverige": "sweden",
    "swedish": "sweden",
    "southgeorgiaandsouthsandwichislands": "southgeorgiaandsouthsandwichislands",
    "southgeorgiaandthesouthsandwichislands": "southgeorgiaandsouthsandwichislands",
    "syria": "syria",
    "syrianarabrepublic": "syria",
    "suriyah": "syria",
    "aljumhuriyahalarabiyahassuriyah": "syria",
    "syrian": "syria",
    "switzerland": "switzerland",
    "swissconfederation": "switzerland",
    "schweizgermansuissefrenchsvizzeraitaliansvizraromansh": "switzerland",
    "schweizerischeeidgenossenschaftgermanconfederationsuissefrenchconfederazionesvizzeraitalianconfederaziunsvizraromansh": "switzerland",
    "swiss": "switzerland",
    "saintbarthelemy": "saintbarthelemy",
    "overseascollectivityofsaintbarthelemy": "saintbarthelemy",
    "saintbartheacutelemy": "saintbarthelemy",
    "collectiviteacutedoutremerdesaintbartheacutelemy": "saintbarthelemy",
    "trinidadandtobago": "trinidadandtobago",
    "republicoftrinidadandtobago": "trinidadandtobago",
    "trinidadiantobagonian": "trinidadandtobago",
    "thailand": "thailand",
    "kingdomofthailand": "thailand",
    "prathetthai": "thailand",
    "ratchaanachakthai": "thailand",
    "thai": "thailand",
    "tajikistan": "tajikistan",
    "republicoftajikistan": "tajikistan",
    "tojikiston": "tajikistan",
    "jumhuriitojikiston": "tajikistan",
    "tajikistani": "tajikistan",
    "turksandcaicosislands": "turksandcaicosislands",
    "none": "holyseevaticancity",
    "tokelau": "tokelau",
    "tokelauan": "tokelau",
    "tonga": "tonga",
    "kingdomoftonga": "tonga",
    "puleangafakatuiotonga": "tonga",
    "tongan": "tonga",
    "togo": "togo",
    "togoleserepublic": "togo",
    "reacutepubliquetogolaise": "togo",
    "togolese": "togo",
    "saotomeandprincipe": "saotomeandprincipe",
    "democraticrepublicofsaotomeandprincipe": "saotomeandprincipe",
    "saotomeeprincipe": "saotomeandprincipe",
    "republicademocraticadesaotomeeprincipe": "saotomeandprincipe",
    "saotomean": "saotomeandprincipe",
    "tunisia": "tunisia",
    "republicoftunisia": "tunisia",
    "tunis": "tunisia",
    "aljumhuriyahattunisiyah": "tunisia",
    "tunisian": "tunisia",
    "timorleste": "timorleste",
    "democraticrepublicoftimorleste": "timorleste",
    "timorlorosaetetumtimorlesteportuguese": "timorleste",
    "republikademokratikatimorlorosaetetumrepublicademocraticadetimorlesteportuguese": "timorleste",
    "timorese": "timorleste",
    "turkey": "turkey",
    "republicofturkey": "turkey",
    "turkeycumhuriyeti": "turkey",
    "turkish": "turkey",
    "tuvalu": "tuvalu",
    "tuvaluan": "tuvalu",
    "taiwan": "taiwan",
    "taiwanortaiwanese": "taiwan",
    "turkmenistan": "turkmenistan",
    "turkmenistani": "turkmenistan",
    "tanzania": "tanzania",
    "unitedrepublicoftanzania": "tanzania",
    "jamhuriyamuunganowatanzania": "tanzania",
    "tanzanian": "tanzania",
    "curacao": "curacao",
    "countryofcuracao": "curacao",
    "curacaodutchkorsoupapiamento": "curacao",
    "landcuracaodutchpaiskorsoupapiamento": "curacao",
    "curacaoandutch": "curacao",
    "uganda": "uganda",
    "republicofuganda": "uganda",
    "ugandan": "uganda",
    "unitedkingdom": "unitedkingdom",
    "unitedkingdomofgreatbritainandnorthernireland": "unitedkingdom",
    "british": "unitedkingdom",
    "bakerislandhowlandislandjarvisislandjohnstonatollkingmanreefmidwayislandspalmyraatoll": "bakerislandhowlandislandjarvisislandjohnstonatollkingmanreefmidwayislandspalmyraatoll",
    "ukraine": "ukraine",
    "ukraina": "ukraine",
    "ukrainian": "ukraine",
    "unitedstates": "unitedstates",
    "unitedstatesofamerica": "unitedstates",
    "american": "unitedstates",
    "burkinafaso": "burkinafaso",
    "burkinabe": "burkinafaso",
    "uruguay": "uruguay",
    "orientalrepublicofuruguay": "uruguay",
    "repuacuteblicaorientaldeluruguay": "uruguay",
    "uruguayan": "uruguay",
    "uzbekistan": "uzbekistan",
    "republicofuzbekistan": "uzbekistan",
    "ozbekiston": "uzbekistan",
    "ozbekistonrespublikasi": "uzbekistan",
    "uzbekistani": "uzbekistan",
    "saintvincentandthegrenadines": "saintvincentandthegrenadines",
    "saintvincentianorvincentian": "saintvincentandthegrenadines",
    "venezuela": "venezuela",
    "bolivarianrepublicofvenezuela": "venezuela",
    "repuacuteblicabolivarianadevenezuela": "venezuela",
    "venezuelan": "venezuela",
    "britishvirginislands": "britishvirginislands",
    "britishvirginislander": "britishvirginislands",
    "vietnam": "vietnam",
    "socialistrepublicofvietnam": "vietnam",
    "conghoaxahoichunghiavietnam": "vietnam",
    "vietnamese": "vietnam",
    "virginislands": "virginislands",
    "virginislander": "virginislands",
    "holyseevaticancity": "holyseevaticancity",
    "theholyseevaticancitystate": "holyseevaticancity",
    "santasedecittadelvaticano": "holyseevaticancity",
    "lasantasedestatodellacittadelvaticano": "holyseevaticancity",
    "namibia": "namibia",
    "republicofnamibia": "namibia",
    "namibian": "namibia",
    "westbank": "westbank",
    "wallisandfutuna": "wallisandfutuna",
    "territoryofthewallisandfutunaislands": "wallisandfutuna",
    "wallisetfutuna": "wallisandfutuna",
    "territoiredesileswallisetfutuna": "wallisandfutuna",
    "wallisianfutunanorwallisandfutunaislander": "wallisandfutuna",
    "westernsahara": "westernsahara",
    "sahrawisahrawiansahraouian": "westernsahara",
    "wakeisland": "wakeisland",
    "samoa": "samoa",
    "independentstateofsamoa": "samoa",
    "malosaolototutoatasiosamoa": "samoa",
    "samoan": "samoa",
    "eswatini": "eswatini",
    "kingdomofeswatini": "eswatini",
    "umbusoweswatini": "eswatini",
    "swatinoteformertermswazistillusedamongenglishspeakers": "eswatini",
    "yemen": "yemen",
    "republicofyemen": "yemen",
    "alyaman": "yemen",
    "aljumhuriyahalyamaniyah": "yemen",
    "yemeni": "yemen",
    "zambia": "zambia",
    "republicofzambia": "zambia",
    "zambian": "zambia",
    "zimbabwe": "zimbabwe",
    "republicofzimbabwe": "zimbabwe",
    "zimbabwean": "zimbabwe"
  };

  /*
  const globalDictionary = ["afghanistan","akrotiri","alarabiyahassuudiyah","albahrayn","albania","algeria","alimaratalarabiyahalmuttahidah","aliraqeraq","aljazair","aljumhuriyahalarabiyahassuriyah","aljumhuriyahalislamiyahalmuritaniyah","aljumhuriyahaljazairiyahaddimuqratiyahashshabiyah","aljumhuriyahallubnaniyah","aljumhuriyahalyamaniyah","aljumhuriyahattunisiyah","alkuwayt","almaghrib","almamlakahalarabiyahassuudiyah","almamlakahalmaghribiyah","almamlakahalurduniyahalhashimiyah","alurdun","alyaman","americansamoa","andorra","angola","anguilla","antarctica","antiguaandbarbuda","arabrepublicofegypt","argentina","argentinerepublic","armenia","aruba","ashmoreandcartierislands","assudan","australia","austria","azarbaycan","azarbaycanrespublikasi","azerbaijan","bahrain","bailiwickofguernsey","bailiwickofjersey","bakerislandhowlandislandjarvisislandjohnstonatollkingmanreefmidwayislandspalmyraatoll","bangladesh","barbados","belarus","belau","belgiquebelgiebelgien","belgium","belize","beluuerabelau","benin","bermuda","bhutan","bolivarianrepublicofvenezuela","bolivia","bosnaihercegovina","bosniaandherzegovina","botswana","bouvetisland","brasil","brazil","britishindianoceanterritory","britishvirginislands","brunei","bruneidarussalam","bulgaria","bundesrepublikdeutschland","burkinafaso","burma","burundi","byelarusbelarusianbelarusrussian","caboverde","cambodia","cameroon","camerouncameroon","canada","caymanislands","centralafricanrepublic","ceskarepublika","cesko","chad","chile","china","choson","chosonminjujuuiinminkonghwaguk","christmasisland","clippertonisland","cocirctedivoire","cocoskeelingislands","collectiviteacutedoutremerdesaintbartheacutelemy","collectiviteacutedoutremerdesaintmartin","colombia","commonwealthofaustralia","commonwealthofdominica","commonwealthofpuertorico","commonwealthofthebahamas","commonwealthofthenorthernmarianaislands","comoros","conghoaxahoichunghiavietnam","congo","congobrazzaville","cookislands","cooperativerepublicofguyana","coralseaislands","coralseaislandsterritory","costarica","cotedivoire","countryofaruba","countryofcuracao","countryofsintmaarten","crnagora","croatia","cuba","curacao","curacaodutchkorsoupapiamento","cyprus","czechia","czechrepublic","danmark","dawlatalkuwayt","dawlatlibiya","dawlatqatar","deacutepartementdesaintpierreetmiquelon","democraticpeoplesrepublicofkorea","democraticrepublicofsaotomeandprincipe","democraticrepublicofthecongo","democraticrepublicoftimorleste","democraticsocialistrepublicofsrilanka","denmark","deutschland","dhekelia","dhivehiraajje","dhivehiraajjeygejumhooriyyaa","djibouti","djiboutifrenchjibutiarabic","dominica","dominicanrepublic","drc","drukgyalkhap","drukyul","dzikolamalawi","ecuador","eesti","eestivabariik","egypt","eire","ellanvannin","ellasorellada","ellinikidimokratia","elsalvador","equatorialguinea","eritrea","ertra","espantildea","estadoplurinacionaldebolivia","estadosunidosmexicanos","estonia","eswatini","ethiopia","falklandislandsislasmalvinas","falklandislands","faroeislands","federaldemocraticrepublicofethiopia","federalrepublicofgermany","federalrepublicofnigeria","federalrepublicofsomalia","federatedstatesofmicronesia","federationofsaintkittsandnevis","federativerepublicofbrazil","fiji","fijienglishvitifijian","finland","foroyar","france","frenchpolynesia","frenchrepublic","frenchsouthernandantarcticlands","fuerstentumliechtenstein","gabon","gaboneserepublic","ganaprajatantribangladesh","gazagazastrip","georgia","germany","ghana","gibraltar","grandducheacutedeluxembourg","grandduchyofluxembourg","greece","greenland","grenada","guahan","guam","guatemala","guernsey","guinea","guineabissau","guineacutee","guineaecuatorialspanishguineacuteeeacutequatorialefrench","guinebissau","guyana","hagereertra","haiti","haiumltifrenchayitihaitiancreole","hanguk","hashemitekingdomofjordan","hayastan","hayastanihanrapetutyun","heardislandandmcdonaldislands","hellenicrepublic","heungkongeiteldyerball","heungkongtakpithangchingkueiteldyerball","holyseevaticancity","honduras","hongkong","hongkongspecialadministrativeregion","hrvatska","hungary","iceland","ileclipperton","independentstateofpapuanewguinea","independentstateofsamoa","india","indiaenglishbharathindi","indonesia","iran","iraq","ireland","islamicrepublicofafghanistanpriortoaugustcurrentcountrynamedisputed","islamicrepublicofiran","islamicrepublicofmauritania","islamicrepublicofpakistan","island","isleofman","israel","italia","italianrepublic","italy","ityopiya","jamaica","jamhuriyamuunganowatanzania","jamhuriyeislamiyeafghanistanpriortoaugustcurrentcountrynameisdisputed","jamhuryatislamipakistan","jamhuuriyaddafederaalkasoomaaliyasomalijumhuriyatassumalalfidiraliyaharabic","janmayen","japan","jersey","jomhuriyeeslamiyeiran","jordan","jumhuriitojikiston","jumhuriyataliraqkomarieraq","jumhuriyatassudan","jumhuriyatmisralarabiyah","kalaallitnunaat","kampuchea","kazakhstan","kenya","kingdomofbahrain","kingdomofbelgium","kingdomofbhutan","kingdomofcambodia","kingdomofdenmark","kingdomofeswatini","kingdomoflesotho","kingdomofmorocco","kingdomofnorway","kingdomofsaudiarabia","kingdomofspain","kingdomofsweden","kingdomofthailand","kingdomofthenetherlands","kingdomoftonga","kiribati","komoricomorianlescomoresfrenchjuzuralqamararabic","kongerigetdanmark","kongeriketnorge","koninkrijkdernederlanden","konungariketsverige","kosovealbaniankosovoserbian","kosovo","kuwait","kypriakidimokratiagreekkibriscumhuriyetiturkish","kyprosgreekkibristurkish","kyrgyzrepublic","kyrgyzrespublikasy","kyrgyzstan","ladominicana","landarubadutchpaisarubapapiamento","landcuracaodutchpaiskorsoupapiamento","landsintmaartendutchcountryofsintmaartenenglish","laopeoplesdemocraticrepublic","laos","lasantasedestatodellacittadelvaticano","latvia","latvija","latvijasrepublika","lebaneserepublic","lebanon","lesotho","liberia","libiya","libya","liechtenstein","lietuva","lietuvosrespublika","lithuania","lubnan","luxembourg","macau","macauspecialadministrativeregion","madagascar","madagascarmadagasikara","magyarorszag","malawi","malaysia","maldives","mali","malosaolototutoatasiosamoa","malta","mamlakatalbahrayn","marshallislands","mauritania","mauritius","medinatyisrael","mexico","misr","mocambique","moldova","monaco","mongolia","mongoluls","montenegro","montserrat","morocco","mozambique","mueanglaounofficial","muritaniyah","myanmanaingngandaw","namibia","nauru","navassaisland","nederland","negarabruneidarussalam","nepal","netherlands","newcaledonia","newzealand","nicaragua","niger","nigeria","nihonkokunipponkoku","nihonnippon","niue","norfolkisland","norge","northernmarianaislands","northkorea","northmacedonia","norway","nouvellecaleacutedonie","oesterreich","oman","orientalrepublicofuruguay","overseascollectivityofsaintbarthelemy","overseascollectivityofsaintmartin","overseaslandsoffrenchpolynesia","ozbekiston","ozbekistonrespublikasi","pakistan","palau","panama","papuanewguinea","papuaniugini","paracelislands","paraguay","paysdoutremerdelapolyneacutesiefranccedilaise","peoplesdemocraticrepublicofalgeria","peoplesrepublicofbangladesh","peoplesrepublicofchina","peru","peruacute","philippines","pilipinas","pitcairnhendersonducieandoenoislands","pitcairnislands","plurinationalstateofbolivia","poland","polska","polyneacutesiefranccedilaise","portugal","portugueserepublic","prathetthai","preahreacheanachakrkampucheaphonetictransliteration","principalityofandorra","principalityofliechtenstein","principalityofmonaco","principatdandorra","principauteacutedemonaco","puertorico","puleangafakatuiotonga","pyidaungzuthammadamyanmanaingngandawtranslatedastherepublicoftheunionofmyanmar","qatar","qazaqstan","qazaqstanrespublikasy","qitaghazzah","ratchaanachakthai","rdc","reacutepubliquecentrafricaine","reacutepubliquedeacutemocratiqueducongo","reacutepubliquedecocirctedivoire","reacutepubliquededjiboutifrenchjumhuriyatjibutiarabic","reacutepubliquedeguineacutee","reacutepubliquedemadagascarrepoblikanimadagasikara","reacutepubliquedemali","reacutepubliquedhaiumltifrenchrepiblikdayitihaitiancreole","reacutepubliquedubenin","reacutepubliqueduburundifrenchrepublikayuburundikirundi","reacutepubliqueducamerounfrenchrepublicofcameroonenglish","reacutepubliqueducongo","reacutepubliqueduniger","reacutepubliqueduseacuteneacutegal","reacutepubliquedutchadjumhuriyattshad","reacutepubliquefranccedilaise","reacutepubliquegabonaise","reacutepubliquetogolaise","reinodeespantildea","repuacuteblicaargentina","repuacuteblicabolivarianadevenezuela","repuacuteblicadechile","repuacuteblicadecolombia","repuacuteblicadecostarica","repuacuteblicadecuba","repuacuteblicadeelsalvador","repuacuteblicadeguatemala","repuacuteblicadehonduras","repuacuteblicadelecuador","repuacuteblicadelparaguay","repuacuteblicadelperuacute","repuacuteblicadenicaragua","repuacuteblicadepanama","repuacuteblicadominicana","repuacuteblicafederativadobrasil","repuacuteblicaorientaldeluruguay","repubblicadisanmarino","repubblicaitaliana","repubblikatamalta","republicadaguinebissau","republicadeangola","republicadecaboverde","republicadeguineaecuatorialspanishreacutepubliquedeguineacuteeeacutequatorialefrench","republicademocambique","republicademocraticadesaotomeeprincipe","republicamoldova","republicaportuguesa","republicofalbania","republicofangola","republicofarmenia","republicofaustria","republicofazerbaijan","republicofbelarus","republicofbenin","republicofbotswana","republicofbulgaria","republicofburundi","republicofcaboverde","republicofcameroon","republicofchad","republicofchile","republicofcocirctedivoire","republicofcolombia","republicofcostarica","republicofcroatia","republicofcuba","republicofcyprus","republicofdjibouti","republicofecuador","republicofelsalvador","republicofequatorialguinea","republicofestonia","republicoffiji","republicoffijienglishmatanitukovitifijian","republicoffinland","republicofgeorgia","republicofghana","republicofguatemala","republicofguinea","republicofguineabissau","republicofhaiti","republicofhonduras","republicofindia","republicofindiaenglishbharatiyaganarajyahindi","republicofindonesia","republicofiraq","republicofkazakhstan","republicofkenya","republicofkenyaenglishjamhuriyakenyaswahili","republicofkiribati","republicofkorea","republicofkosovo","republicoflatvia","republicofliberia","republicoflithuania","republicofmadagascar","republicofmalawi","republicofmaldives","republicofmali","republicofmalta","republicofmauritius","republicofmoldova","republicofmozambique","republicofnamibia","republicofnauru","republicofnicaragua","republicofniger","republicofnorthmacedonia","republicofpalau","republicofpanama","republicofparaguay","republicofperu","republicofpoland","republicofrwanda","republicofsanmarino","republicofsenegal","republicofserbia","republicofseychelles","republicofsierraleone","republicofsingapore","republicofslovenia","republicofsouthafrica","republicofsouthsudan","republicofsuriname","republicoftajikistan","republicofthecongo","republicofthegambia","republicofthemarshallislands","republicofthephilippines","republicofthesudan","republicoftrinidadandtobago","republicoftunisia","republicofturkey","republicofuganda","republicofuzbekistan","republicofvanuatu","republicofyemen","republicofzambia","republicofzimbabwe","republieksuriname","republikabulgaria","republikademokratikatimorlorosaetetumrepublicademocraticadetimorlesteportuguese","republikaekosovesalbanianrepublikakosovoserbian","republikaeshqiperise","republikahrvatska","republikangpilipinas","republikasevernamakedonija","republikaslovenija","republikasrbija","republikayurwanda","republikindonesia","republikoesterreich","respublikabyelarusbelarusianrespublikabelarusrussian","ripablikblongvanuatu","romania","rossiya","rossiyskayafederatsiya","royaumedebelgiquefrenchkoninkrijkbelgiedutchkoenigreichbelgiengerman","russia","russianfederation","rwanda","rzeczpospolitapolska","saintbartheacutelemy","saintbarthelemy","sainthelenaascensionandtristandacunha","saintkittsandnevis","saintlucia","saintmartin","saintpierreandmiquelon","saintpierreetmiquelon","saintvincentandthegrenadines","sakartvelo","saltanatuman","samoa","sanmarino","santasedecittadelvaticano","saotomeandprincipe","saotomeeprincipe","sathalanalatpaxathipataipaxaxonlao","saudiarabia","schweizerischeeidgenossenschaftgermanconfederationsuissefrenchconfederazionesvizzeraitalianconfederaziunsvizraromansh","schweizgermansuissefrenchsvizzeraitaliansvizraromansh","seacuteneacutegal","senegal","serbia","severnamakedonija","seychelles","shqiperia","shrilankaprajatantrikasamajavadijanarajayasinhalailankaijananayakachoshalichakkutiyarachutamil","shrilankasinhalailankaitamil","sierraleone","singapore","sintmaarten","sintmaartendutchandenglish","slovakia","slovakrepublic","slovenia","slovenija","slovenskarepublika","slovensko","socialistrepublicofvietnam","solomonislands","somalia","soomaaliyasomaliassumalarabic","southafrica","southgeorgiaandsouthsandwichislands","southgeorgiaandthesouthsandwichislands","southkorea","southsudan","spain","spratlyislands","srbija","srilanka","stateoferitrea","stateofisrael","stateofkuwait","stateoflibya","stateofqatar","sudan","sultanateofoman","suomentasavaltafinnishrepublikenfinlandswedish","suomifinnishfinlandswedish","suriname","suriyah","svalbardsometimesreferredtoasspitsbergenthelargestislandinthearchipelago","sverige","sweden","swissconfederation","switzerland","syria","syrianarabrepublic","taehanminguk","taiwan","tajikistan","tanzania","tchadtshad","terresaustralesetantarctiquesfranccedilaises","territoiredesileswallisetfutuna","territoiredesnouvellecaleacutedonieetdeacutependances","territorialcollectivityofsaintpierreandmiquelon","territoryofashmoreandcartierislands","territoryofchristmasisland","territoryofcocoskeelingislands","territoryofheardislandandmcdonaldislands","territoryofnewcaledoniaanddependencies","territoryofnorfolkisland","territoryofthefrenchsouthernandantarcticlands","territoryofthewallisandfutunaislands","thailand","thebahamas","thedominican","thegambia","theholyseevaticancitystate","timorleste","timorlorosaetetumtimorlesteportuguese","togo","togoleserepublic","tojikiston","tokelau","tonga","trinidadandtobago","tunis","tunisia","turkey","turkeycumhuriyeti","turkmenistan","turksandcaicosislands","tuvalu","udzimawakomoricomorianuniondescomoresfrenchalittihadalqumuriarabic","uganda","ukraina","ukraine","uman","umbusoweswatini","unionofburma","unionofthecomoros","unitedarabemirates","unitedkingdom","unitedkingdomofgreatbritainandnorthernireland","unitedmexicanstates","unitedrepublicoftanzania","unitedstates","unitedstatesofamerica","uruguay","uzbekistan","vanuatu","venezuela","vietnam","virginislands","wakeisland","wallisandfutuna","wallisetfutuna","westbank","westernsahara","yeityopiyafederalawidemokrasiyawiripeblik","yemen","yisrael","zambia","zhongguo","zhonghuarenmingongheguo","zimbabwe"];
*/

  // --- LOCAL STORAGE & DATE SETUP ---
  const todayStr = new Date().toLocaleDateString('en-CA'); // Gets local YYYY-MM-DD
  const dailyIndex = Math.floor(Date.now() / 86400000) % countryFiles.length;
  let currentTargetFile = countryFiles[dailyIndex];

  // Load Lifetime Stats
  let stats = JSON.parse(localStorage.getItem('factbookleStats')) || {
    wins: 0, losses: 0, streak: 0, bestStreak: 0, lastPlayedDate: null
  };

  // Load Daily State (Reset if it's a new day!)
  let dailyState = JSON.parse(localStorage.getItem('factbookleState')) || { date: todayStr, guesses: [], isGameOver: false, isWin: false };
  if (dailyState.date !== todayStr) {
    dailyState = { date: todayStr, guesses: [], isGameOver: false, isWin: false };
    localStorage.setItem('factbookleState', JSON.stringify(dailyState));
  }

  // Game State
  let countryData = null;
  let validNames = [];
  let rawNamesForRedaction = [];
  let displayCountryName = "Unknown";
  let availableClues = [];
  let pastGuesses = [];
  let guessesLeft = 6;
  let isGameOver = false;

  // DOM Elements
  const guessInput = document.getElementById('country-guess');
  const guessBtn = document.getElementById('guess-btn');
  const autocompleteList = document.getElementById('autocomplete-list');
  const cluesContainer = document.getElementById('clues-container');
  const guessesDisplay = document.getElementById('guesses-left');
  const feedbackMsg = document.getElementById('feedback-msg');
  const endScreen = document.getElementById('end-screen');
  const pastGuessesContainer = document.getElementById('past-guesses-container');
  const pastGuessesDiv = document.getElementById('past-guesses');
  const imageModal = document.getElementById('image-modal');
  const modalImg = document.getElementById('modal-img');
  const flagImg = document.getElementById('reveal-flag');
  const mapImg = document.getElementById('reveal-map');
  const shareBtn = document.getElementById('share-btn');


  // Update UI Stats
  function updateStatsUI() {
    const totalPlayed = stats.wins + stats.losses;
    const winPct = totalPlayed === 0 ? 0 : Math.round((stats.wins / totalPlayed) * 100);
    document.getElementById('stat-wins').innerText = `Wins: ${stats.wins}`;
    document.getElementById('stat-losses').innerText = `Losses: ${stats.losses}`;
    document.getElementById('stat-winpct').innerText = `Win %: ${winPct}`;
    document.getElementById('stat-streak').innerText = `Streak: ${stats.streak}`;
    document.getElementById('stat-best').innerText = `Best: ${stats.bestStreak}`;
  }

  function getCaseInsensitive(obj, keyName) {
    if (!obj || typeof obj !== 'object') return null;
    const key = Object.keys(obj).find(k => k.toLowerCase() === keyName.toLowerCase());
    return key ? obj[key] : null;
  }

  // Initial Fetch
  fetch(`factbook/${currentTargetFile}`)
    .then(response => response.json())
    .then(data => {
      countryData = data;
      const govData = getCaseInsensitive(data, "government");
      const namesData = getCaseInsensitive(govData, "country name");

      if (namesData) {
        const checkAndAdd = (obj) => {
          if (obj && obj.text && obj.text.toLowerCase() !== "none") {
            validNames.push(obj.text.toLowerCase().replace(/[^a-z]/g, ''));
            rawNamesForRedaction.push(obj.text);
          }
        };
        checkAndAdd(getCaseInsensitive(namesData, "conventional short form"));
        checkAndAdd(getCaseInsensitive(namesData, "conventional long form"));
        checkAndAdd(getCaseInsensitive(namesData, "local short form"));
        checkAndAdd(getCaseInsensitive(namesData, "local long form"));

        const peopleData = getCaseInsensitive(data, "people and society");
        const natData = getCaseInsensitive(peopleData, "nationality");
        const adj = getCaseInsensitive(natData, "adjective");
        if (adj && adj.text) rawNamesForRedaction.push(adj.text);

        const shortForm = getCaseInsensitive(namesData, "conventional short form");
        const longForm = getCaseInsensitive(namesData, "conventional long form");
        displayCountryName = (shortForm && shortForm.text !== "none") ? shortForm.text :
                              (longForm && longForm.text !== "none") ? longForm.text : "Unknown";
      }

      prepClues();
      updateStatsUI();
      revealNextClue(); // Reveal the free 1st clue

      // --- NEW: Restore Past Game State ---
      if (dailyState.guesses.length > 0) {
        dailyState.guesses.forEach(rawGuess => {
          const normalized = rawGuess.toLowerCase().replace(/[^a-z]/g, '');
          const canonical = countryAliasMap[normalized]; // Lookup the master ID

          pastGuesses.push(canonical); // Save the master ID so they can't guess aliases
          guessesLeft--;
          guessesDisplay.innerText = `Remaining Guesses: ${guessesLeft}`;

          pastGuessesContainer.classList.remove('hidden');
          const pill = document.createElement('span');
          pill.className = 'guess-pill';
          pill.innerText = rawGuess; // Keep displaying exactly what they typed!
          pastGuessesDiv.appendChild(pill);

          if (!validNames.includes(normalized) && guessesLeft > 0) revealNextClue();
        });
      }

      // --- OLD: Restore Past Game State ---
      /*
      if (dailyState.guesses.length > 0) {
        dailyState.guesses.forEach(rawGuess => {
          const normalized = rawGuess.toLowerCase().replace(/[^a-z]/g, '');
          pastGuesses.push(normalized);
          guessesLeft--;
          guessesDisplay.innerText = `Remaining Guesses: ${guessesLeft}`;

          pastGuessesContainer.classList.remove('hidden');
          const pill = document.createElement('span');
          pill.className = 'guess-pill';
          pill.innerText = rawGuess;
          pastGuessesDiv.appendChild(pill);

          // Only reveal a new clue if the game didn't end on this guess
          if (!validNames.includes(normalized) && guessesLeft > 0) revealNextClue();
        });
      }
      */

      // If they already won or lost today, immediately trigger the end screen (skip saving stats)
      if (dailyState.isGameOver) {
        endGame(dailyState.isWin, true);
      }
    })
    .catch(err => {
      feedbackMsg.innerText = "Error loading secure database connection.";
      feedbackMsg.className = "error";
      feedbackMsg.classList.remove('hidden');
    });

  function formatClueData(obj) {
    if (typeof obj !== 'object' || obj === null) return String(obj);
    let parts = [];
    if (obj.text) parts.push(obj.text);
    for (const [key, value] of Object.entries(obj)) {
      if (key === 'text') continue;
      if (typeof value === 'object' && value !== null) {
        const formatted = formatClueData(value);
        if (formatted) parts.push(`<strong>${key}:</strong> ${formatted}`);
      } else {
        parts.push(`<strong>${key}:</strong> ${value}`);
      }
    }
    return parts.join(' <span style="color:#a9c191; font-weight:bold;">|</span> ');
  }

  function prepClues() {
    rawNamesForRedaction = rawNamesForRedaction.filter(n => n.length > 2);
    rawNamesForRedaction.sort((a, b) => b.length - a.length);
    const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const redactionRegexes = rawNamesForRedaction.map(name => new RegExp(escapeRegExp(name), 'gi'));

    for (const [catName, category] of Object.entries(countryData)) {
      const catLower = catName.toLowerCase();
      if (catLower === 'introduction' || catLower === 'military and security') continue;

      for (const [subName, subcategory] of Object.entries(category)) {
        const subLower = subName.toLowerCase();
        if (catLower === 'government' && (subLower === 'country name' || subLower === 'capital')) continue;
        if (catLower === 'economy' && subLower === 'exchange rates') continue;
        if (catLower === 'people and society' && (subLower === 'nationality' || subLower === 'languages')) continue;

        let combinedText = formatClueData(subcategory);
        if (combinedText.trim().length > 0) {
          redactionRegexes.forEach(regex => {
              combinedText = combinedText.replace(regex, '██████');
          });
          availableClues.push({ category: catName, subcategory: subName, text: combinedText });
        }
      }
    }

    // --- NEW: Deterministic Fisher-Yates Shuffle ---
    // This guarantees the exact same clue order across page refreshes!
    let seed = dailyIndex + 1;
    function random() {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    }
    for (let i = availableClues.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [availableClues[i], availableClues[j]] = [availableClues[j], availableClues[i]];
    }
  }

  function revealNextClue() {
    if (availableClues.length === 0) return;
    const clue = availableClues.pop();
    const clueEl = document.createElement('div');
    clueEl.className = 'clue-card';
    clueEl.innerHTML = `
      <div class="clue-meta">${clue.category} &rarr; ${clue.subcategory}</div>
      <p class="clue-text">${clue.text}</p>
    `;
    cluesContainer.prepend(clueEl);
  }

  function handleGuess() {
    if (isGameOver) return;
    const rawGuess = guessInput.value.trim();
    if (!rawGuess) return;

    const normalizedGuess = rawGuess.toLowerCase().replace(/[^a-z]/g, '');
    guessInput.value = "";

    // 1. Look up the Master ID for whatever alias they typed
    const canonicalGuess = countryAliasMap[normalizedGuess];

    // 2. If it's not in the map, it's not a valid country
    if (!canonicalGuess) {
      feedbackMsg.innerText = "Entity not recognized. Please try a valid country or territory.";
      feedbackMsg.className = "error";
      feedbackMsg.classList.remove('hidden');
      return;
    }

    // 3. Check if they already guessed the Master ID
    if (pastGuesses.includes(canonicalGuess)) {
      feedbackMsg.innerText = "You already guessed that country.";
      feedbackMsg.className = "error";
      feedbackMsg.classList.remove('hidden');
      return;
    }

    // 4. Register the guess using the Master ID!
    pastGuesses.push(canonicalGuess);
    pastGuessesContainer.classList.remove('hidden');

    const pill = document.createElement('span');
    pill.className = 'guess-pill';
    pill.innerText = rawGuess; // Display what they typed
    pastGuessesDiv.appendChild(pill);

    // --- NEW: Save the guess to Local Storage ---
    dailyState.guesses.push(rawGuess);
    localStorage.setItem('factbookleState', JSON.stringify(dailyState));
    /*
    if (isGameOver) return;
    const rawGuess = guessInput.value.trim();
    if (!rawGuess) return;

    const normalizedGuess = rawGuess.toLowerCase().replace(/[^a-z]/g, '');
    guessInput.value = "";

    if (pastGuesses.includes(normalizedGuess)) {
      feedbackMsg.innerText = "You already guessed that country.";
      feedbackMsg.className = "error";
      feedbackMsg.classList.remove('hidden');
      return;
    }
    if (!globalDictionary.includes(normalizedGuess)) {
      feedbackMsg.innerText = "Entity not recognized. Please try a valid country or territory.";
      feedbackMsg.className = "error";
      feedbackMsg.classList.remove('hidden');
      return;
    }

    pastGuesses.push(normalizedGuess);
    pastGuessesContainer.classList.remove('hidden');

    const pill = document.createElement('span');
    pill.className = 'guess-pill';
    pill.innerText = rawGuess;
    pastGuessesDiv.appendChild(pill);

    // --- NEW: Save the guess to Local Storage ---
    dailyState.guesses.push(rawGuess);
    localStorage.setItem('factbookleState', JSON.stringify(dailyState));

    */
    if (validNames.includes(normalizedGuess)) {
      endGame(true);
    } else {
      guessesLeft--;
      guessesDisplay.innerText = `Guesses: ${guessesLeft}`;

      if (guessesLeft <= 0) {
        endGame(false);
      } else {
        feedbackMsg.innerText = "Incorrect. A new clue has been revealed.";
        feedbackMsg.className = "error";
        feedbackMsg.classList.remove('hidden');
        revealNextClue();
        guessInput.focus();
      }
    }
  }

  guessBtn.addEventListener('click', handleGuess);

  guessInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleGuess();
  });

  guessInput.addEventListener('input', function() { // dropdown for help with spelling
    const val = this.value.toLowerCase().trim();
    autocompleteList.innerHTML = ''; // Clear out the old list

    if (!val) {
      autocompleteList.classList.add('hidden');
      return;
    }

    // Filter the dictionary for any country that INCLUDES the typed letters
    const matches = displayDictionary.filter(country => country.toLowerCase().includes(val));

    if (matches.length > 0) {
      autocompleteList.classList.remove('hidden');

      matches.forEach(match => {
        const li = document.createElement('li');
        li.innerText = match;

        // When they click a suggestion, fill the box and hide the list!
        li.addEventListener('click', () => {
          guessInput.value = match;
          autocompleteList.classList.add('hidden');
          guessInput.focus(); // Snap the cursor back so they can easily hit "Guess"
        });

        autocompleteList.appendChild(li);
      });
    } else {
      autocompleteList.classList.add('hidden');
    }
  });

  // If the user clicks anywhere else on the page, hide the dropdown
  document.addEventListener('click', function(e) {
    if (e.target !== guessInput && e.target !== autocompleteList) {
      autocompleteList.classList.add('hidden');
    }
  });

  // --- NEW: isRestore flag prevents double-counting stats on refresh ---
  function endGame(isWin, isRestore = false) {
    isGameOver = true;
    guessInput.disabled = true;
    guessBtn.disabled = true;

    feedbackMsg.innerText = isWin ? "You figured it out!": "Better luck next time :/";
    feedbackMsg.className = isWin ? "success" : "error";
    feedbackMsg.classList.remove('hidden');

    const endTitle = document.getElementById('end-title');
    endTitle.innerText = isWin ? "Success!" : "Failure :(";
    endTitle.style.color = isWin ? "var(--accent-main)" : "var(--error-color)";

    if (shareBtn) shareBtn.style.display = 'block'; // reveal share button

    document.getElementById('reveal-country-name').innerText = displayCountryName;

    const baseFileName = currentTargetFile.replace('.json', '');
    const validExtensions = ['webp', 'gif', 'svg', 'png', 'jpg', 'jpeg'];

    function findAndLoadImage(imgElement, folder) {
      let currentExtIndex = 0;
      imgElement.onload = null;
      imgElement.onerror = null;

      const tryNextExtension = () => {
        if (currentExtIndex >= validExtensions.length) {
          imgElement.style.display = 'none';
          return;
        }
        imgElement.onload = () => { imgElement.style.display = 'block'; };
        imgElement.onerror = () => {
          currentExtIndex++;
          tryNextExtension();
        };
        imgElement.src = `images/${folder}/${baseFileName}.${validExtensions[currentExtIndex]}`;
      };
      tryNextExtension();
    }

    if (flagImg) findAndLoadImage(flagImg, 'flags');
    if (mapImg) findAndLoadImage(mapImg, 'maps');

    const govData = getCaseInsensitive(countryData, "government");
    const namesData = getCaseInsensitive(govData, "country name");
    let nameHtml = "";
    if (namesData) {
      for (const [key, val] of Object.entries(namesData)) {
          if (val.text && val.text.toLowerCase() !== "none") nameHtml += `<strong>${key}:</strong> ${val.text}<br>`;
      }
    }
    document.getElementById('reveal-names').innerHTML = nameHtml;

    const introData = getCaseInsensitive(countryData, "introduction");
    const bgData = getCaseInsensitive(introData, "background");
    document.getElementById('reveal-background').innerHTML = bgData?.text || "No background available.";

    const accordion = document.getElementById('full-data-accordion');
    accordion.innerHTML = ""; // Clear out old data if restoring
    for (const [catName, category] of Object.entries(countryData)) {
      if (catName.toLowerCase() === 'introduction') continue;
      const details = document.createElement('details');
      details.className = 'fact-category';
      const summary = document.createElement('summary');
      summary.innerText = catName;
      details.appendChild(summary);

      const contentDiv = document.createElement('div');
      contentDiv.className = 'fact-content';

      for (const [subName, subcategory] of Object.entries(category)) {
          let formattedText = formatClueData(subcategory);
          if (formattedText.trim().length > 0) {
            contentDiv.innerHTML += `<div style="margin-bottom: 12px;"><strong><u>${subName}</u>:</strong><br>${formattedText}</div>`;
          }
      }
      details.appendChild(contentDiv);
      accordion.appendChild(details);
    }

    endScreen.classList.remove('hidden');
    if (!isRestore) endScreen.scrollIntoView({ behavior: 'smooth' });

    // --- NEW: Save Stats (Only if this is a fresh win/loss, not a refresh!) ---
    if (!isRestore) {
      dailyState.isGameOver = true;
      dailyState.isWin = isWin;

      if (isWin) stats.wins++;
      else stats.losses++;

      // Streak logic (Days in a row played)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toLocaleDateString('en-CA');

      if (stats.lastPlayedDate === yesterdayStr) {
        stats.streak++;
      } else if (stats.lastPlayedDate !== todayStr) {
        stats.streak = 1; // Reset to 1 if they missed a day
      }

      if (stats.streak > stats.bestStreak) stats.bestStreak = stats.streak;
      stats.lastPlayedDate = todayStr;

      localStorage.setItem('factbookleStats', JSON.stringify(stats));
      localStorage.setItem('factbookleState', JSON.stringify(dailyState));
      updateStatsUI();
    }
  }

  // Lightbox Click Listeners
  if (flagImg) {
    flagImg.addEventListener('click', () => {
      modalImg.src = flagImg.src;
      imageModal.classList.remove('hidden');
    });
  }
  if (mapImg) {
    mapImg.addEventListener('click', () => {
      modalImg.src = mapImg.src;
      imageModal.classList.remove('hidden');
    });
  }
  if (imageModal) {
    imageModal.addEventListener('click', () => {
      imageModal.classList.add('hidden');
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !imageModal.classList.contains('hidden')) {
      imageModal.classList.add('hidden');
    }
  });

  // --- Share Button Logic (Native Mobile Share + Desktop Clipboard) ---
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      const guessCount = dailyState.isWin ? dailyState.guesses.length : 'x';
      const statusText = dailyState.isWin ? "WIN" : "LOSS";
      const globes = ['🌎', '🌍', '🌏'];

      let emojis = "";
      for (let i = 0; i < dailyState.guesses.length; i++) {
        if (dailyState.isWin && i === dailyState.guesses.length - 1) {
          emojis += "🗺️";
        } else if (!dailyState.isWin && i === 5) {
          emojis += "🤯";
        } else {
          emojis += globes[Math.floor(Math.random() * globes.length)];
        }
      }

      const shareText = `Factbookle ${dailyState.date}\nGuesses: ${guessCount}/6\n${statusText}\n${emojis}\nhttps://sagerans.com/factbook`;

      // NEW: Detect if it's a mobile device
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      // If Web Share API is supported AND we are on mobile, pop the native share sheet
      if (navigator.share && isMobile) {
        navigator.share({
          text: shareText
        }).catch(err => {
          // If the user dismisses the share sheet, do nothing.
          // We just catch the error so the console doesn't complain.
          console.log("Share sheet dismissed or failed:", err);
        });
      } else {
        // Fallback for Desktop: Copy to clipboard
        navigator.clipboard.writeText(shareText).then(() => {
          const originalText = shareBtn.innerText;
          shareBtn.innerText = "Copied!";
          setTimeout(() => { shareBtn.innerText = originalText; }, 2000);
        }).catch(err => {
          alert("Failed to copy to clipboard.");
        });
      }
    });
  }
});
