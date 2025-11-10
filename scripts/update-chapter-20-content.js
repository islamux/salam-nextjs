/**
 * Update Chapter 20 with actual content from converted Dart files
 * This script adds titles, subtitles, texts, and ayahs to Chapter 20
 */

const fs = require('fs');
const path = require('path');

// Chapter 20 Arabic text content (converted from Dart)
const ElmTextTwenty = {
  // Page 1
  titleTwentyOne: `ماهي التقوى ?`,
  elmTextTwentyOne_1: `الذي لا شك فيه أن كلمة التقوى وردت في القرآن الكريم في أكثر من ثلاثمائة موضع ، والأحاديث الشهيرة والصحيحة تؤكد في مجملها أن التقوى جماع كل خير`,
  elmTextTwentyOne_2: `فما هي التقوى ؟ الحقيقة أن التقوى مشتقة من فعل ثلاثي ، الفعل هو وقى ، والوقاية تكون من شيئ خطير ، فربنا سبحانه وتعالى يقول`,
  ayahHadithTwentyOne1: `يا ايها الناس اعبدو ربكم الذي خلقكم والذين من قبلكم لعلكم تتقون`,
  subtitleTwentyOne_1: `العبادة هي سبيل التقوى`,
  elmTextTwentyOne_3: `معنى ذلك أن العبادة هي سبيل الوقاية ، فأنت إذا دعوت إلى الله يجب أن تعتمد على حاجات الإنسان الفطرية ، وما منا واحد إلا وهو في حاجةٍ ماسة جداً إلى أن ينجو من شقاء الدنيا وعذاب الآخرة ، ففي نفس كل منا ميل جامح وحاجة مُلحة إلى النجاة

والله سبحانه وتعالى يقول`,
  ayahHadithTwentyOne_2: `ياايها الناس اعبدوا ربكم الذي خلقكم والذين من قبلكم لعلكم تتقون`,

  // Page 2
  subtitleTwentyTwo_1: `في اللغة العربية هناك قاعدة`,
  elmTextTwentyTwo_1: `أن الفعل إذا حُذف المفعول به المتعلق به أطلق الفعل ، تتقون ماذا ؟
تتقون كُل خطر ، كل مكروه ، كل منزلق ، كل شقاء ، كل عذاب ، كل ضيق ، كل قلق ، كل مصيبة`,
  ayahHadithTwentyTwo_1: `ياايها الناس اعبدوا ربكم الذي خلقكم والذين من قبلكم لعلكم تتقون`,
  elmTextTwentyTwo_2: `إذاً لا سبيل إلى تحقيق النجاة ، ولا سبيل إلى تحقيق السلامة ، ولا سبيل إلى أن يبتعد الإنسان عن شقاء الدنيا وعذاب الآخرة إلا بطاعة الله عز وجل
لذلك فسر بعضهم التقوى بأنها إتقاء عذاب الله بطاعته
أي لا منجأ منك إلا إليك
لايستطيع الإنسان أن ينجو من التأديب الالهي ، ولا من المعالجة الإلهية ، ولا من العقاب الإلهي ، ولا من القضاء الذي يقضيه الله عز وجل للإنسان إلا بطاعة الله عز وجل
هذه النقطة الأولى

إذاً طاعة الله عز وجل سبيل إلى التقوى`,

  // Page 3
  subtitleTwentyThree_1: `الإنسان له بناء مؤسس على تقوى الله`,
  elmTextTwentyThree_1: `نقطة ثانية ، الإنسان له بناء ، معنى البناء أنت لك منظومة قيم ، في الموضوع الفلاني لك موقف ، في علاقتك بالنساء لك موقف ، في علاقتك بكسب المال لك موقف ، في علاقتك بإنفاق المال لك موقف ، في علاقتك بالجوار لك موقف ، في علاقتك بالبيع والشراء لك موقف ، في علاقتك بالشهوة التي أودعها الله فيك لك موقف ، هذه المواقف تنبع من رؤية أو من قيم ،
فالله سبحانه وتعالى يقول`,
  ayahHadithTwentyThree_1: `أفمن أسس بُنيانه`,
  elmTextTwentyThree_2: `أنت لك بناء ، الأسرة لبنة ، العمل لبنة ، علاقتك بذاتك لبنة ، علاقتك بالخالق لبنة ، علاقتك بأهلك ، بالوالد ، بالوالدة ، بالإخوة ، بالأخوات ، بالأصهار ، كل موقف ، وكل حركة وكل سكنة تنبع من رؤية أو من قيمة ،
فالمؤمن أسس بنيانه على تقوى من الله ورضوان ، إذاً فالله سبحانه وتعالى لا بد من أن يحميه`,

  // Page 4
  subtitleTwentyFour_1: `غير المؤمن بناءُه مؤسس على الشهوة والمصلحة`,
  elmTextTwentyFour_1: `غير المؤمن أسس بنيانه على الشهوة ، على المصلحة ، على انتهاز الفُرص ، على القنص ، على حب الذات ، على الأنانية ، هذا البناء المبني على غير تقوى الله عز وجل كأنه على شفا جرفٍ هار فانهار به في نار جهنم ، فكل إنسان له بناء ، إما أن يبني هذا البناء على تقوى الله ورضوان ، وإما أن يبني هذا البناء على شفا جرفٍ هار فانهار به في نار جهنم`,
  subtitleTwentyFour_2: `في الكون إله واحد يستحق العبادة`,
  elmTextTwentyFour_2: `الشيئ الثاني أن الإنسان حينما يفكر ، ففي هذا الكون العظيم حقيقة كبرى ، حقيقة وحيدة ، حقيقة ليس بعدها حقيقة هي الله سبحانه وتعالى ، فهل من جهة بالكون تستحق أن يخشى عذابها ، أو ان ترجو رحمتها غير الله ؟
فهل في الكون جهة تستحق أن يرجى ماعندها ، وأن يخشى عقابها غير الله عز وجل؟`,
  ayahHadithTwentyFour_1: `الله لا اله الا هو الحي القيوم`,

  // Page 5
  elmTextTwentyFive_1: `أي قيام الشيئ بالله ، حياته بالله ، كن فيكون زُل فيزول
إذاً في الكون حقيقة وحيدة ليس بعدها حقيقة هي الله سبحانه وتعالى ، أيُعقل أن تخشى غير الله؟
أيعقل أن ترجو غير الله؟
أيعقل أن تطمع بعطاء غير عطاء الله؟
أيعقل أن تخاف من غير الله؟
أيعقل أن تتقي عذاب غير الله؟
أيعقل أن ترجو رحمة غير الله؟
لذلك ربنا عز وجل في آية صغيرة قال`,
  ayahHadithTwentyFive_1: `أفغير الله تتقون
فما لكم كيف تحكمون`,
  elmTextTwentyFive_2: `كيف تفكرون؟ كيف تتأملون؟
ربنا عز وجل طمأنك فقال على لسان أحد رسله`,
  ayahHadithTwentyFive_2: `فكيدوني جميعاً ثم لا تنظرون اني توكلت على الله ربي وربكم ما من دابة الا هو اخذ بناصيتها`,
  elmTextTwentyFive_3: `قال لك`,
  ayahHadithTwentyFive_3: `واليه يرجع الأمر كله`,
  elmTextTwentyFive_4: `قال لك`,
  ayahHadithTwentyFive_4: `مايفتح الله للناس من رحمة فلا ممسك لها`,

  // Page 6
  elmTextTwentySix_1: `قال لك`,
  ayahHadithTwentySix_1: `له الخلق والأمر`,
  elmTextTwentySix_2: `قال لك`,
  ayahHadithTwentySix_2: `يد الله فوق ايديهم`,
  elmTextTwentySix_3: `فإذا خشيت غير الله أو رجوت غير الله فلست متقياً
أي: لم تتق الله عز وجل`,
  ayahHadithTwentySix_3: `أفغير الله تتقون`,
  elmTextTwentySix_4: `أنت في قبظته ، ولماذا عليك أن تتقي الله؟
لأن الله عليم بك ، وبكل مايحيط بك..`,

  // Page 7
  ayahHadithTwentySeven_1: `واتقو الله واعلمو ان الله مع المتقين`,
  elmTextTwentySeven_1: `إذا كان الإنسان مراقباً فإنه يخافُ هذا الذي يراقبه ، فربنا عزوجل رقابته عليك مستمرة
فما دامت رقابة الله عليك مستمرة ألا ينبغي أن تتقي الله؟`,
  ayahHadithTwentySeven_2: `واتقوا الله واعلموا ان الله بكل شيئ عليم
واتقوا الله إن الله سريع الحساب
واتقوا الله واعلموا انكم اليه تحشرون`,
  elmTextTwentySeven_2: `عليم بكل造形 ، شديد العقاب ، سريع الحساب
إليه نُحشر
ألا تكفي هذه الدوافع كي تتقي الله عزوجل؟`,
  ayahHadithTwentySeven_3: `قُل سيروا في الأرض ثم انظروا كيف كان عاقبة المكذبين`,

  // Page 8
  subtitleTwentyEight_1: `الله علم عباده طريق التقوى`,
  elmtTextTwentyEight_1: `النقطة الدقيقة أن الله عزوجل علمك
علمك من خلال هذا العقل الذي اودعه الله فيك
وعلمك من خلال هذا الكون الذي نصب فيه الأدله على عظمته
وعلمك من ملامح الفطرة التي فطرك عليها
وعلمك من خلال هذا الكتاب الكريم الذي أنزله على النبي العظيم
وعلمك من خلال السنه النبوية المطهرة التي بينت هذا الكتاب
وعلمك من الحوادث اليومية ، هذه الحوادث اليومية فيها تعليم للإنسان
تشف هذه الحوادث عن قدرته ، وعن حكمته ، وعن عدالته
وعلمك من خلال دعوة الدعاة
وإلهام الملائكة ، فأنت في حالة تعلم مستمر
والله سبحانه وتعالى يعلمك دائماً ، إن في الكتاب ، وإن في السنة ، وإن في الكون ، وإن في العقل ، وإن في الفطرة ، وإن في دعوة الدعاة ، وإن في الهام الملائكة
أنت في حالة تعليم مستمر
فلم لا تتقي الله عزوجل؟
هذا معنى قوله تعالى`,

  // Page 9
  ayahHadithTwentyNine_1: `واتقوا الله ويعلمكم الله`,
  elmTextTwentyNine_1: `نحن نشعر أننا في قبضة الله عز وجل ، كل أجهزتك ، كل احوالك ، ورأسُ مالك عقلك
نقطة دم صغيرة جداً إذا تجمدت في بعض شرايين المخ يففد الإنسان عقله دفعة واحدة
 أو يفقد ذاكرته
أو يفقد سمعه أو بصره
أو يفقد حركته
إذاً أنت في قبضة الله
بجسمك
او بروحك
وبنفسك
وببيتك
وبأهلك
وبأولادك
وبعملك
وبمن حولك
وبمن فوقك
وبمن تحتك
:لذلك`,
  ayahHadithTwentyNine_2: `أفغير الله تتقون`,

  // Page 10
  titleTwentyTen: `الله هو أهل التقوى`,
  elmTextTwentyTen_1: `لكن هناك معنى دقيق جداً وهو أنك يجب أن تتقي ربك ، لا لأنك بقبضته فحسب؛ بل لأنه أهل التقوى وأهل المغفرة
أي انه رحمن رحيم ، ذوالجلال والإكرام ، ذوالطول والإنعام ، يعلم السر وأخفى ، عفو كريم ، رحمن رحيم ، لطيف رؤوف
فأنت من جهة تتقي ربك لأنك في قبضته
ومن جهة ثانية تتقي ربك لأنه أهل التقوى وأهل المغفرة
سبحان الله فالإنسان يتوق إلى أن يتقرب من إنسان عظيم ، ولكن ألا يتوق إلى أن يتقرب من خالق الأكوان؟
خالق الأكوان وضع نظاماً للتعامل معه ، قد يكون شخص عظيم مزاجي الطبع ، وأنت لا تدري كيف تتقرب إليه ، قد يصل إلى قلبه بعض الناس صُدفه أو بظرف طارئة، لكن الله سبحانه وتعالى والخلق كلهم عباده، رسم لهم خطة علاقة منظمه تكون أساساً في تعامل العباد مع خالقهم سبحانه وتعالى، لا كما يتعامل الناس مع شخص ما له مزاجه وظروفه`,

  // Page 11
  titleTwentyEleven: `الله يحب المتقين`,
  elmTextTwentyEleven_1: `خلاصة هذه العلاقة أن ربنا عز وجل قال`,
  ayahHadithTwentyEleven_1: `إن الله يحب المتقين`,
  elmTextTwentyEleven_2: `فالتقوى منهم والعون والحب منه
القضية واضحة كالشمس الله عزوجل يحب المتقين
 أفلا يحب الإنسان أن يكون محبوباً عند الله عز وجل؟
إذا أحبك إنسان قوي فيما يبدو للناس ، فهذا الإنسان لا ينفعك حُبه ولا يضرك بغضه
ولكن إذا أحبك الله عز وجل ألقى حبك في قلوب خلقه فكنت عند الله وخلقه محبوباً
     ينادى له في الكون أنا نحبه
     فيسمع من في الكون أمر مُحِبنا`,

  // Page 12
  elmTextTwentyTwelve_1: `إذاً : إذا اتقيت الله سبحانه وتعالى أحبك الله ، وهل من مرتبة في الكون أرقى من مرتبة القرب من الله
الدنيا كلها مراتب
 مراتب مالية، مراتب علمية، مراتب اجتماعية، ومراتب رياضية، يقول لك: معه وسام ذهبي، وهناك معه ميدالية برونزية، مراتب نفسية ومراتب جسمية، ومراتب دينية، ألا تعتقد معي أن أعظم مرتبة ينالها إنسان على وجه الأرض هي القرب من الله، وأن يحبه الله عزوجل؟`,
  ayahHadithTwentyTwelve_1: `إن الله يحب المتقين`,
  elmTextTwentyTwelve_2: `أتق الله أن تعصيه يحبك الله عز وجل
اتق أن تسخطه يحبك
اتق أن تخالف أمره
اتق عقابه بطاعته
اتق عذابه بالاستقامة على أمره
اتق ناره بالعمل لجنته، يحبك`,

  // Page 13
  elmTextTwentyThirteen_1: `لكن ألا تحب أن يكون الله معك?`,
  subtitleTwentyThirteen_1: `معية الله بالحفظ ملازمة للمتقين`,
  elmTextTwentyThirteen_2: `هل تدري أن معية الله نوعان
معية عامة
معية خاصة
الله مع كل مخلوق لقوله تعالى`,
  ayahHadithTwentyThirteen_1: `وهو معكم أين ماكنتم`,
  elmTextTwenteThirteen_3: `ولكن المعية الخاصة معية الحفظ
معية الرعاية
معية النصر
معية التأييد
ألا تتمنى أن يكون الله معك?`,

  // Page 14
  ayahHadithTwentyFourteen_1: `إن الله مع المتقين`,
  elmTextTwentyFourteen_1: `ألا يتمنى الانسان أن يكون خالق الأكوان مدافعاً عنه?
ألا تتمنى أن يكون وليك هو الله عز وجل
الولي يخرجك من الظلمات إلى النور
يجعل لك مقعد صدق عنده
يدافع عنك
يكيد لك
ألا تتمنى ذلك?`,
  ayahHadithTwentyFourteen_2: `والله ولي المتقين
إن الله يحب المتقين
إن الله مع المتقين
والله ولي المتقين`,

  // Page 15
  elmTextTwentyFifteen_1: `وربنا عز وجل قال`,
  ayahHadithTwentyFifteen_1: `أم نجعل المتقين كالفجار`,
  elmTextTwentyFifteen_2: `فمن السذاجة، ومن الغباء، ومن ضيق الأفق، ومن الجهل أن تتصور أن هذا الذي استقام على أمر الله، وتعرف إلى الله، وأمضى وقتاً في تعلم العلم، وكان منظبطاً، ضبط حواسه الخمس، ضبط مشاعره، ضبط كسبه، ضبط إنفاقه، وكان محسناً، أحسن إلى كل مخلوق
هذا المتقي الذي يتقي غضب الله، يتقي سخط الله، يتقي عذاب الله، أهذا المتقي أيعقل أن يعامل كالفاجر؟ كالعاصي؟
كالذي يفعل المعاصي على قارعة الطريق؟ كالذي يتباهى بالمعصية؟ شيئ مستحيل
فلو أتيح لك أن تقرأ الآيات القرآنية التي تتحدث عن التقوى لوجدت أن في هذه الآيات معاني كبيرة جداً، وربنا عز وجل أمرنا أن نكون طموحين، يقول بعضهم: أنا اريد مكاناً وراء الباب في الجنة، هذا كلام غيرصحيح، ربنا عز وجل علمنا في القرآن الكريم أن ندعو الله عز وجل ونقول
والذين يقولون ربنا هب لنا من ازواجنا وذرياتنا قرة اعين واجعلنا للمتقين إماما`,

  // Page 16
  titleTwentySixteen: `التقوى درجات ومستويات`,
  elmTextTwentySixteen_2: `لا ترضى إلا أن تكون إماماً، والتقوى درجات، التقوى مستويات كبيرة جداً
في أدنى مستوياتها أن تتقي عذاب الله بطاعته، هذا الذي يغض بصره عن محارم الله يتقي الله
هذا الذي يخاف أن يأكل مالاً حراماً يتقي الله
هذا الذي يخاف أن يكذب يتقي الله
هذا الذي يخاف أن تصدر منه مخالفة يتقي الله، هذا مستوى
فهذا الرجل المؤمن يحاول أن يطبق أمر الله، هذا نوع من التقوى
ولكن هناك درجة عالية من التقوى أنك إذا اتقيت الله عزوجل قذف الله في قلبك النور، فهذا سيدنا يوسف، بربك امرأة حسناء ذات منصب وجمال، امرأة العزيز، وغلقت الأبواب، وهو غير متزوج، وليس في بلده، وعبد لها، وليس من مصلحتها أن يفشوا هذا الأمر، وقد أمرته بذلك، لماذا امتنع؟ ماذا رأى حتى قال: معاذ الله؟ رؤية قلبية، هذا هو النور الذي يقذفه الله في قلب المؤمن يرى به الخير خيراً والشر شراً، الحق حقاً والباطل باطلاً، الصواب صواباً والخطأ خطأ، الصحيح صحيحاً والزيف زيفاً، هذا هو النور
لذلك فإن الدرجة الأولى أن تقرأ الأحكام
تقرأ الأوامر
تقرأ النواهي
تطبق
هذا مستوى من التقوى`,

  // Page 17
  elmTextTwentySeventeen_1: `أما المستوى الأعلى أن تجتهد في الإستقامة وأن تجتهد في البذل والتضحية حتى تنعقد الصلة مع الله عزوجل، إذا انعقدت هذه الصلة، فمن خلال هذه الصلة يتجلى الله على قلبك بنوره، عندئذ تصبح مستنير القلب
فإنها لا تعمى الأبصار ولكن تعمى القلوب التي في الصدور
وعندئذ ترى في المعصية الوبال، والقطيعة، والدمار، والتأخر، والتدهور، والعقاب

وعندئذ تقبل على الطاعة وتبتعد عن المعصية، هذا هو النور الذي قال الله عنه`,
  ayahHadithTwentySeventeen_1: `ياايها الذين آمنو إن تتقو الله يجعل لكم فرقانا`,

  // Page 18
  elmTextTwentyEighteen_1: `ياايها الذين امنو اتقو الله وآمنو برسوله يؤتكم كفلين من رحمته ويجعل لكم نوراً تمشون به
نور تمشي به في الناس، هذا الذي يأخذ ماليس له أعمى هذا الذي يُمتع عينه بما لا يحل له أعمى
هذا الذي يؤثر نفسه على إخوانه أعمى
هذا الذي يستضعف إنساناً ويظلمه، يقول لك: هذه مقطوعة ليس لها أحد أعمى، لو أن قلبه استنار بنور الله لرأى أن الله ولي هذه المرأة
فإذا تجاوز حده معها نكل الله به، هكذا فالمستويات كثيرة جداً`,

  // Page 19
  titleTwentyNineteen: `تزكية وتقييم الناس من شأن الله وحده`,
  elmTextTwentyNineteen_1: `شيئ آخر وهو موضوع التزكية، موضوع تقييم الذات هذا من شأن الله عزوجل
مؤمنون كثيرون يخوضون فيما لا حق لهم أن يخوضوا فيه
تقييم الإنسان من شأن الله عزوجل`,
  ayahHadithTwentyNineteen_1: `النبي عليه الصلاة والسلام حينما عاتب أحد أصحابه بقتل إنسان في المعركة قال: لا إله إلا الله، فعن أسامة بن زيد قال: بعثنا رسول الله صل الله عليه وسلم في سرية، فصبحنا الحرقات من جهينة فأدركت رجلا فقال لا إله إلا الله فطعنتُهُ، فوقع في نفسي من ذلك، فذكرتُهُ للنبي صلى الله عليه وسلم،，他说رسول الله صلى الله عليه وسلم
أقال لا إله إلا الله، وقتلته؟
قال: قلت: يارسول الله إنما قالها خوفا من السلاح، قال: أفلا شققت عن قلبه حتى تعلم أقالها أم لا فما زال يكررها علي حتى تمنيت اني اسلمت يومئذ`,

  // Page 20
  elmTextTwentyTwenty_1: `لذلك الأدب أن تحكم بالظاهر والله يتولى السرائر`,
  ayahHadithTwentyTwenty_1: `وكفى بربك بذنوب عباده خبيراً بصيرا`,
  elmTextTwentyTwenty_2: `الأدب أن تمتنع عن إصدار الأحكام على الناس، تقول: هذا من شأن الله وليس من شأن البشر
لذلك قال ربنا عزوجل`,
  ayahHadithTwentyTwenty_2: `فلا تزكوا أنفسكم هو أعلم بمن اتقى`,
  subtitleTwentyTwenty_1: `التقوى خير زاد`,
  elmTextTwentyTwenty_3: `الإنسان يتزوج، الإنسان يجمع الأموال، يقول: هذه الأموال تنفعني في خريف العمر
الإنسان أحياناً يبني بناء شامخاً، يقول لك: أريد بيتاً فيه كل جيد وجديد، ينتقي أفضل الأثاث، ينتقي أفضل الكسوة، ينتقي أفضل الأجهزة، وقد يقتني أفضل سيارة، يقول لك: أريد شيئاً جيداً
كله من نوع الزاد
تزودت هذه السيارة، هذا البيت، هذا الأثاث
هذه الأجهزة الضخمة، تزودت بأموال تدخرها لوقت خريف العمر، لكن ربنا عزوجل قال بكلمة موجزة، قال`,
  ayahHadithTwentyTwenty_3: `وتزودوا فإن خير الزاد التقوى`,

  // Page 21
  elmTextTwentyTwentyOne_1: `أي أن أعظم زاد تدخره أن تتقي الله، لا أن تعصي الله
من هنا سيدنا عمر كان إذا أصابته مصيبة قال`,
  ayahHadithTwentyTwentyOne_1: `الحمدلله ثلاثاً الحمدلله إذ لم تكن في ديني`,
  elmTextTwentyTwentyOne_2: `هذه قاعدة، الدين سليم مالم تعصي الله عزوجل، مالم تقترب من حدوده، مالم تعتد على حدوده، مالم تخرق قواعد الاستقامة، مالم تسيئ إلى إنسان، مالم يكن في عنقك دين لأحد، أو ظلامة لأحد، فقد سلم دينك?`,
  subtitleTwentyTwentyOne_1: `التقوى سبيل الأمن والعافية والرضا`,
  elmTextTwentyTwentyOne_3: `دائماً وازن
   من اصبح منكم آمناً في سربه
هذا أمن الإيمان، أنت مطمئن لعدالة الله، أنت مطمئن إلى أن الأمور كلها بيد الله، وأن الله رحمن رحيم، أنت مطمئن إلى أنه لا إله إلا الله، أنت مطمئن إلى أنه لا رافع ولا خافض، ولا معز ولا مذل، ولا معطي ولا مانع، ولا باسط ولا قابض إلا الله
أنت مطمئن إلى أن الله سبحانه وتعالى يدخرُ لك عنده عطاءًيجا
   ولسوف يعطيك ربك فترضى`,

  // Page 22
  elmTextTwentyTwentyTwo_1: `إذا كنت كذلك فأنت في نعمة لاتعدلها نعمة على وجه الأرض، نعمة أمن الإيمان، وإذا ادعى أحد أن عنده أمناً بسبب الأموال الطائلة فهذا أمن مزيف، لأن الله عزوجل قد يعاجل هذا الإنسان بمصيبة لا قيمة للمال إطلاقاً في حلها، وإذا كان عند الإنسان أمن بحسب صحته الطيبة، وتدريباته ونشاطه، ونظام قاس جداً يتبعه، هذا أمن مزيف
الأمن الحقيقي أن تكون بما في يدي الله أوثق منك مما في يديك، هذا أعلى درجة من درجات الأمن، لذلك`,
  ayahHadithTwentyTwentyTwo_1: `عن عبدالله بن محصن الخطمي قال: قال رسول الله صلى الله عليه وسلم
من أصبح منكم آمناً في سربه، معافى في جسده، عنده قوت يومه فكأنما حيزت له الدنيا`,
  elmTextTwentyTwentyTwo_2: `إذا كنت كذلك فقد ملكت الدنيا بكل حذافيرها
أمن الإيمان، وسلامة الأبدان، وشيئ تقتات به، وانتهى الأمر، لذلك فالمؤمن لو أصابته مصيبة، مادام دينه سليماً، مادامت صحته طيبه، مادمت أفعاله كريمة، فلا شيئ في الدنيا يضيره`,

  // Page 23
  subtitleTwentyTwentyThree_1: `تقوى القلوب أفضل لباس المسلم`,
  elmTextTwentyTwentyThree_1: `انظر إلى هذه المعاني الدقيقة، أحياناً تجد إنساناً قد أكرمه الله عز وجل بقوام جميل، بشكل وسيم، قد يكون ذا ذوق رفيع في ارتداء الثياب، له أذواق رفيعة جداً، قد يكون له ذوق عال جداً في أقتناء الأثاث، قد يختار سيارة جيدة، قد يعتني بها عناية بالغة، قد يُلبسُ أولاده أجمل الألبسة، قد يفرش بيته بأجمل الأثاث، ربنا عز وجل قال في كلمة`,
  ayahHadithTwentyTwentyThree_1: `ولباس التقوى ذلك خير`,
  elmTextTwentyTwentyThree_2: `لباس التقوى ذلك خير، هذا الذي ينفعك بعد الموت، هذا الذي يستمر أثره إلى ما بعد الموت`,
  ayahHadithTwentyTwentyThree_2: `ولباس التقوى ذلك خير`,
  elmTextTwentyTwentyThree_3: `المظهر لا قيمة له`,
  ayahHadithTwentyTwentyThree_3: `إن الله لا ينظر إلى صوركم وأموالكم ولكن ينظر إلى قلوبكم وأعمالكم (من صحيح مسلم عن ابي هريرة)`,

  // Page 24
  elmTextTwentyTwentyFour_1: `القلب بيت الرب، ومنظرالله عز وجل، يقول الله عز وجل`,
  ayahHadithTwentyTwentyFour_1: `عبدي طهرت منظر الخلق سنين، أفلا طهرت منظري ساعة?`,
  elmTextTwentyTwentyFour_2: `ألا تستحيي من الله أن يطلع الله عليك فيرى في هذا القلب حقداً، أو حسداً، أو يرى فيه أنانية، أو حباً للذات؟

ألا تستحيي من الله أن يطلع الله على قلبك فيراه ممتلئاً بحب الدنيا؟

ألا تستحيي من الله عز وجل أن يطلع على قلبك وفيه نية ماكرة لبعض المؤمنين؟ ألا تستحيي؟
طهرت منظر الخلق سنين أفلا طهرت منظري ساعة?`,
  ayahHadithTwentyTwentyFour_2: `ولباس التقوى ذلك خير
وتزودوا فإن خير الزاد التقوى`,

  // Page 25
  subtitleTwentyTwentyFive_1: `التقوى طريق الجنة`,
  elmTextTwentyTwentyFive_2: `لكن عليك بتقوى الله دائماً، فكل شيئ له ثمن كل شيئ له ثمن، لو أن احداً طلب مثلاً قطعة أثاث فاخرة جداً من مستوى رفيع جداً، فهذا الطلب العالي يقابله ثمن غالٍ دائماً، الشيئ المتقن ثمنه غالٍ، والشيئ غير المتقن ثمنه رخيص، ولكن هل في الحياة كلها، هل في الحياة الدنيا والآخرة عطاءً يفوق عطاء الأخرة؟ مالا عين رأت، ولا أذن سمعت، ولا خطر على قلب بشر، هذه الآخرة الأبدية السرمدية حياة مافيها نغص، ولا فيها قلق، ولا فيها أحزان، ولا فيها منافسة، ولا فيها زوال، ولا فيها تدني
هذه الحياة فيها? ما لا عين رأت ولا أذن سمعت، ولا خطر على قلب بشر..
فلا تعلم نفس ما أخفي لهم من قرة أعين
هذه الآخرة أتظن أن ثمنها بسيط؟ ثمنها يسير؟ ركعتان تُصليهُما وانتهى الأمر، لا والله، ألا إن سلعة الله غالية
الله عز وجل قال`,

  // Page 26
  ayahHadithTwentyTwentySix_1: `أم حسبتم ان تدخلوا الجنة ولما يعلم الله الذين جاهدوا منكم ويعلم الصابرين`,
  elmTextTwentyTwentySix_1: `ألا فلتعلم أن سلعة الله غالية، وطريق الجنة ليست طريقاً محفوفة بالرياحين، إنها طريق محفوفة بالمكاره`,
  ayahHadithTwentyTwentySix_2: `هكذا قال عليه الصلاة والسلام
حفت الجنة بالمكاره وحفت النار بالشهوات (من صحيح مسلم عن أنس بن مالك)`,

  // Page 27
  subtitleTwentyTwentySeven_1: `آيات قرآنية متحدثة عن التقوى`,
  elmTextTwentyTwentySeven_1: `الآية الأولى`,
  ayahHadithTwentyTwentySeven_1: `وسيُجنبها الأتقى`,
  elmTextTwentyTwentySeven_2: `الأتقى اسم تفضيل، فهناك في اللغة تقي وأتقى، وكريم وأكرم، أما الأتقى ماصفاته الأساسية؟
قال`,
  ayahHadithTwentyTwentySeven_2: `الذي يؤتي ماله يتزكى`,
  elmTextTwentyTwentySeven_3: `المال: الله عز وجل أكرمنا به ليكون وسيلة للتقرُب إليه، أحد الصحابة الكرام قال: حبذا المال أصون به عرضي، وأتقرب به إلى ربي
كلمات بليغات أصون به عرضي؛ أولادك، أهلك، أمك أبوك بحاجةٍ إليك، صنت بهذا المال عرضك، وتقربت به إلى ربك، فربنا عز وجل يصف الأتقى لا يصف التقي، قال`,
  ayahHadithTwentyTwentySeven_3: `وسيجنبها الأتقى الذي يؤتي ماله يتزكى`,

  // Page 28
  elmTextTwentyTwentyEight_1: `الآية الثانية`,
  ayahHadithTwentyTwentyEight_1: `ولكم في القصاص حياة يا أولي الألباب لعلكم تتقون
وقد نتعرف إلى مؤمن كبير جداً، أساس إيمانه عقاب ناله من الله، خالف الشرع، فجاءه عقاب إلهي، فالقصاص أحد الطرق المؤدية إلى التقوى`,

  elmTextTwentyTwentyEight_2: `الآية الثالثة`,
  ayahHadithTwentyTwentyEight_2: `وينجي الله الذين اتقو بمفازتهم لا يمسهم السؤ ولا هم يحزنون`,
  elmTextTwentyTwentyEight_3: `لم يقل الله عزوجل: لا يصيبهم السوء؛ بل قال`,
  ayahHadithTwentyTwentyEight_3: `لا يمسهم`,

  // Page 29
  elmTextTwentyTwentyNine_1: `الآية الرابعة`,
  ayahHadithTwentyTwentyNine_1: `إن المتقين في جنات وعيون اخذين ما اتاهم ربهم إنهم كانوا قبل ذلك محسنين`,
  elmTextTwentyTwentyNine_2: `الآية الخامسة`,
  ayahHadithTwentyTwentyNine_2: `إن المتقين في جنات ونهر`,
  elmTextTwentyTwentyNine_3: `الآية السادسة`,
  ayahHadithTwentyTwentyNine_3: `إن المتقين في جنات ونعيم`,
  elmTextTwentyTwentyNine_4: `الآية السابعة`,
  ayahHadithTwentyTwentyNine_4: `إن المتقين في ظلال وعيون`,
  elmTextTwentyTwentyNine_5: `الآية الثامنة`,
  ayahHadithTwentyTwentyNine_5: `إن المتقين في جنات وعيون`,
  elmTextTwentyTwentyNine_6: `الآية التاسعة`,
  ayahHadithTwentyTwentyNine_6: `إن المتقين في جنات ونعيم`,
  elmTextTwentyTwentyNine_7: `الآية الحادية عشرة`,
  ayahHadithTwentyTwentyNine_7: `والعاقبة للمتقين`,
  elmTextTwentyTwentyNine_8: `الآية الثانية عشرة`,
  ayahHadithTwentyTwentyNine_8: `والعاقبة للتقوى`,

  // Page 30
  elmTextTwentyThirty_1: `أي أن في النهاية لا يسعد إلا المتقي، لا يفوز إلا المتقي، لا ينجو إلا المتقي، لا يُفلح إلا المتقي، لا ينجح إلا المتقي، لا يسعد إلا المتقي`,
  ayahHadithTwentyThirty_1: `والعاقبة للمتقين
والعاقبة للتقوى`,
  elmTextTwentyThirty_2: `لكن من أجل أن تقطف ثمار التقوى يانعة ربنا عز وجل يقول`,
  ayahHadithTwentyThirty_2: `خذوا ما اتيناكم بقوة`,
  elmTextTwentyThirty_3: `بقوة، هناك أخذ بلين، ومسايرة، ومجاملة للآخرين، مواقفه دائماً ضبابية، دائماً متردد، دائماً مُرتاب، دائماً يُطيع الله ولكن على مضض، يخاف أن يعصيه، ولكن يرغب أن يعصيه، هذا الموقف المتردد الضبابي، موقف الأخذ والرد، موقف المتخاذل، موقف متردد، هذه المواقف ليست من صفات المؤمنين`,

  // Page 31
  ayahHadithTwentyThirtyOne_1: `ومن يتق الله يجعل له مخرجا`,
  elmTextTwentyThirtyOne_1: `القرآن الكريم فيه شيئ رائع جداً، هذا الشيئ هو أن الآية وهي في سياقها لها معنى، فإذا نزعتها من سياقها وقرأتها وحدها فلها معنى آخر، وهذا من اعجاز القرآن، كل آية إن انتظمت مع أخواتها تؤدي معنى محدداً، أما حينما تنزع من سياقها فتؤدي معنى شمولياً كبيراً جداً`,
  ayahHadithTwentyThirtyOne_2: `ومن يتق الله يجعل له مخرجاً`,
  elmTextTwentyThirtyOne_2: `هذه الآية وردت في سورة الطلاق، معناها السياقي: أي ان من يتق الله في تطليق زوجته؛ يطلقها وفق السنة، يطلقها لعدتها، يطلقها في طهر مامسها فيه، يطلقها وهو اعتقد أن الله لعله يحدث بعد ذلك أمرا، يجعل الله له مخرجاً إلى الرجوع إليها، لو أنه ندم بإمكانه أن يُرجعها، لو أنه تأثر لفراقها بإمكانه أن يرجعها`,
  ayahHadithTwentyThirtyOne_3: `ومن يتق الله يجعل لهُ مخرجا`,

  // Page 32
  elmTextTwentyThertyTwo_1: `لو نزعنا هذه الآية من سياقها يُكتب عليها مجلدات
إذا نُزعت من سياقها اصبحت قاعدة
من يتق الله في اختيار زوجته يجعل له مخرجاً من تطليقها
من ربى اولاده تربية إسلامية جعل الله له مخرجاً من عقوق الأولاد،
من كسب المال وفق السُنة بالطريق المشروع جعل الله له مخرجاً من إتلاف المال وضياعه
من اتقى الله في أداء زكاة ماله يجعل الله له مخرجاً من ضياع الأموال وإتلافها
من اتقى الله في معرفته يجعل الله له مخرجاً من المعاصي التي ترتكب بسبب الجهل بالله عز وجل
من اتقى الله في أصول معاملة الزوجة يجعل الله له مخرجاً من النكد الزوجي، والشقاء الزوجي، والخصومة الزوجية
من يتق الله في اختيار البيت المناسب، اختاره في حي محافظ، بعيد عن الشُبُهات، بعيد عن التفلُت يجعل الله له مخرجاً من انحراف الأولاد`,

  // Page 33
  elmTextTwentyThirtyThree_1: `هذه الآية يمكن أن تُطبق على مليون حالة، إذا نزعت من سياقها أصبحت قاعدة`,
  ayahHadithTwentyThirtyThree_1: `ومن يتق الله يجعل له مخرجا`,
  elmTextTwentyThirtyThree_2: `والآية تشير بشكل أو بأخر إلى أنه قبل أن يخلق الله المخرج لم يكن هناك مخرجاً، يبدو أن الأمر مستعص، الأمر مغلق، الأمر لا يوجد فيه فرج`,
  subtitleTwentyThirtyThree_1: `من يتق الله في الحرام يجعل الله له مخرجاً`,
  elmTextTwentyThirtyThree_3: `أحياناً يضعك في ظرف كل أبواب الحلال مغلقة، وكل الأبواب المشروعة مغلقة، وكل الطرق الآمنة مغلقة، وكل الأسباب التي رسمها الله عز وجل مغلقة ثم يفتح الله لك باب الحرام، باب المعصية، باب النفاق، باب الكذب، ويمتحنك، المؤمن يقول: والله لن أعصي الله ما حييت، ولن أتساهل في منهج الله قيد أنملة`,
  subtitleTwentyThirty33_2: `من اتقى الله عز وجل جاءه رزق وفير من حيث لا يحتسب`,
  ayahHadithTwentyThirtyThree_2: `ومن يتق الله يجعل له مخرجاًويرزقه من حيث لا يحتسب`,
  elmTextTwentyThirtyThree_4: `فهذه الآية دقيقة، أحياناً تعرض عليك الدنيا من طريق غير مشروع، قد يأتيك رزق وفير من معصية، من عمل مشبوه، من إنجاز عمل لا يرضي الله، من طريقة لا ترضي الله، هذا المال الوفير الذي يأتيك من هذا الطريق لا بركة فيه، وقد يذهب، ويُذهب معه صاحبه، لكنك إذا اتقيت الله عز وجل جاءك رزق وفير من حيث لا تحتسب`,

  // Page 34
  ayahHadithTwentyThirtyFour_1: `ومن يتق الله يجعل له مخرجاًويرزقه من حيث لا يحتسب`,
  elmTextTwentyThirtyFour_1: `لكن لا تطالب الله بالوقت، الوقت له حكمته، أنت عليك أن تعبد الله، الآية دقيقة، وهذه نقطة مهمة جداً

لابد من ضيق ليظهر صدق الإنسان مع الله وبعد ذلك يأتي فرج الله:

لما ربنا عز وجل قال`,
  ayahHadithTwentyThirtyFour_2: `ياايها الذين امنوا إنما المشركون نجس فلا يقربوا المسجد الحرام بعد عامهم هذا`,
  elmTextTwentyThirtyFour_2: `فهذه السياحة قديمة، حينما يأتي هؤلاء إلى المسجد الحرام يشترون الطعام والشراب، يسكنون في البيوت، ينفقون أموالاً كثيرة جداً، والأن تكاد تكون صناعة السياحة أروج صناعةٍ في كل البلاد، وتحقق أكبر دخل من العملات الصعبة، فربنا عز وجل قال`,
  ayahHadithTwentyThirtyFour_3: `ياايها الذين آمنوا إنما المشركون نجس`,
  elmTextTwentyThirtyFour_3: `ماقال: نجسون، قال
   ( نجس )
أي هم عين النجاسة
   فلا يقربو المسجد الحرام بعد عامهم هذا
طبعاً من لوازم هذا المنع انخفاض الدخل، طبيعي، قال`,

  // Page 35
  ayahHadithTwentyThirtyFive_1: `وإن خفتم عيلة`,
  elmTextTwentyThirtyFive_1: `أي فقراً`,
  ayahHadithTwentyThirtyFive_2: `فسوف يغنيكم الله من فضله`,
  elmTextTwentyThirtyFive_2: `لكن لم يقل: يغنيكم، قال
   ( فسوف )

أي أنه لا بد من مرحلة من أجل أن يظهر صدقكم مع الله، من أجل أن يظهر ثباتكم على الحق، من أجل أن تظهر مؤاثراتكم، أي يارب، رضاك أغلى عندنا من كل造形

قال تعالى:
   ( فسوف )
وبعد حين يأتي فرج الله عز وجل، هذه الآية قانون، أي انسان إذا اتقى الله عز وجل وصرف نفسه من دخل كبير فيه شبهة، وقنع بالقليل الذي لا يكفيه لأنه حلال، قد يعاني بعض الوقت ليدفع ثمن هذا القرار الحكيم، ليدفع ثمن هذه الطاعة، وبعد حين يرزقه الله من حيث لا يحتسب، فالإنسان لايستعجل، فمن كان يريد لقاء الله فإن أجل الله آت`,
};

function updateChapter20() {
  const dataPath = path.join(__dirname, '..', 'public', 'khwater-data.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  const chapter20Items = [
    {
      texts: [
        ElmTextTwenty.elmTextTwentyOne_1,
        ElmTextTwenty.elmTextTwentyOne_2,
        ElmTextTwenty.elmTextTwentyOne_3,
      ],
      titles: [ElmTextTwenty.titleTwentyOne],
      ayahs: [
        ElmTextTwenty.ayahHadithTwentyOne1,
        ElmTextTwenty.ayahHadithTwentyOne_2,
      ],
      subtitles: [ElmTextTwenty.subtitleTwentyOne_1],
      order: ['texts', 'titles', 'texts', 'ayahs', 'subtitles', 'texts', 'ayahs'],
    },
    {
      subtitles: [ElmTextTwenty.subtitleTwentyTwo_1],
      texts: [
        ElmTextTwenty.elmTextTwentyTwo_1,
        ElmTextTwenty.elmTextTwentyTwo_2,
      ],
      ayahs: [ElmTextTwenty.ayahHadithTwentyTwo_1],
      order: ['subtitles', 'texts', 'ayahs', 'texts'],
    },
    {
      subtitles: [ElmTextTwenty.subtitleTwentyThree_1],
      texts: [
        ElmTextTwenty.elmTextTwentyThree_1,
        ElmTextTwenty.elmTextTwentyThree_2,
      ],
      ayahs: [ElmTextTwenty.ayahHadithTwentyThree_1],
      order: ['subtitles', 'texts', 'ayahs', 'texts'],
    },
    {
      subtitles: [
        ElmTextTwenty.subtitleTwentyFour_1,
        ElmTextTwenty.subtitleTwentyFour_2,
      ],
      texts: [
        ElmTextTwenty.elmTextTwentyFour_1,
        ElmTextTwenty.elmTextTwentyFour_2,
      ],
      ayahs: [ElmTextTwenty.ayahHadithTwentyFour_1],
      order: ['subtitles', 'texts', 'subtitles', 'texts', 'ayahs'],
    },
    {
      texts: [
        ElmTextTwenty.elmTextTwentyFive_1,
        ElmTextTwenty.elmTextTwentyFive_2,
        ElmTextTwenty.elmTextTwentyFive_3,
        ElmTextTwenty.elmTextTwentyFive_4,
      ],
      ayahs: [
        ElmTextTwenty.ayahHadithTwentyFive_1,
        ElmTextTwenty.ayahHadithTwentyFive_2,
        ElmTextTwenty.ayahHadithTwentyFive_3,
        ElmTextTwenty.ayahHadithTwentyFive_4,
      ],
      order: ['texts', 'ayahs', 'texts', 'ayahs', 'texts', 'ayahs', 'texts', 'ayahs'],
    },
    {
      texts: [
        ElmTextTwenty.elmTextTwentySix_1,
        ElmTextTwenty.elmTextTwentySix_2,
        ElmTextTwenty.elmTextTwentySix_3,
        ElmTextTwenty.elmTextTwentySix_4,
      ],
      ayahs: [
        ElmTextTwenty.ayahHadithTwentySix_1,
        ElmTextTwenty.ayahHadithTwentySix_2,
        ElmTextTwenty.ayahHadithTwentySix_3,
      ],
      order: ['texts', 'ayahs', 'texts', 'ayahs', 'texts', 'ayahs', 'texts'],
    },
    {
      ayahs: [
        ElmTextTwenty.ayahHadithTwentySeven_1,
        ElmTextTwenty.ayahHadithTwentySeven_2,
        ElmTextTwenty.ayahHadithTwentySeven_3,
      ],
      texts: [
        ElmTextTwenty.elmTextTwentySeven_1,
        ElmTextTwenty.elmTextTwentySeven_2,
      ],
      order: ['ayahs', 'texts', 'ayahs', 'texts', 'ayahs'],
    },
    {
      subtitles: [ElmTextTwenty.subtitleTwentyEight_1],
      texts: [ElmTextTwenty.elmtTextTwentyEight_1],
      order: ['subtitles', 'texts'],
    },
    {
      ayahs: [
        ElmTextTwenty.ayahHadithTwentyNine_1,
        ElmTextTwenty.ayahHadithTwentyNine_2,
      ],
      texts: [ElmTextTwenty.elmTextTwentyNine_1],
      order: ['ayahs', 'texts', 'ayahs'],
    },
    {
      titles: [ElmTextTwenty.titleTwentyTen],
      texts: [ElmTextTwenty.elmTextTwentyTen_1],
      order: ['titles', 'texts'],
    },
    {
      titles: [ElmTextTwenty.titleTwentyEleven],
      texts: [
        ElmTextTwenty.elmTextTwentyEleven_1,
        ElmTextTwenty.elmTextTwentyEleven_2,
      ],
      ayahs: [ElmTextTwenty.ayahHadithTwentyEleven_1],
      order: ['titles', 'texts', 'ayahs', 'texts'],
    },
    {
      texts: [
        ElmTextTwenty.elmTextTwentyTwelve_1,
        ElmTextTwenty.elmTextTwentyTwelve_2,
      ],
      ayahs: [ElmTextTwenty.ayahHadithTwentyTwelve_1],
      order: ['texts', 'ayahs', 'texts'],
    },
    {
      texts: [
        ElmTextTwenty.elmTextTwentyThirteen_1,
        ElmTextTwenty.elmTextTwentyThirteen_2,
        ElmTextTwenty.elmTextTwenteThirteen_3,
      ],
      subtitles: [ElmTextTwenty.subtitleTwentyThirteen_1],
      ayahs: [ElmTextTwenty.ayahHadithTwentyThirteen_1],
      order: ['texts', 'subtitles', 'texts', 'ayahs', 'texts'],
    },
    {
      ayahs: [
        ElmTextTwenty.ayahHadithTwentyFourteen_1,
        ElmTextTwenty.ayahHadithTwentyFourteen_2,
      ],
      texts: [ElmTextTwenty.elmTextTwentyFourteen_1],
      order: ['ayahs', 'texts', 'ayahs'],
    },
    {
      texts: [
        ElmTextTwenty.elmTextTwentyFifteen_1,
        ElmTextTwenty.elmTextTwentyFifteen_2,
      ],
      ayahs: [ElmTextTwenty.ayahHadithTwentyFifteen_1],
      order: ['texts', 'ayahs', 'texts'],
    },
    {
      titles: [ElmTextTwenty.titleTwentySixteen],
      texts: [ElmTextTwenty.elmTextTwentySixteen_2],
      order: ['titles', 'texts'],
    },
    {
      texts: [ElmTextTwenty.elmTextTwentySeventeen_1],
      ayahs: [ElmTextTwenty.ayahHadithTwentySeventeen_1],
      order: ['texts', 'ayahs'],
    },
    {
      texts: [ElmTextTwenty.elmTextTwentyEighteen_1],
      order: ['texts'],
    },
    {
      titles: [ElmTextTwenty.titleTwentyNineteen],
      texts: [ElmTextTwenty.elmTextTwentyNineteen_1],
      ayahs: [ElmTextTwenty.ayahHadithTwentyNineteen_1],
      order: ['titles', 'texts', 'ayahs'],
    },
    {
      texts: [
        ElmTextTwenty.elmTextTwentyTwenty_1,
        ElmTextTwenty.elmTextTwentyTwenty_2,
        ElmTextTwenty.elmTextTwentyTwenty_3,
      ],
      ayahs: [
        ElmTextTwenty.ayahHadithTwentyTwenty_1,
        ElmTextTwenty.ayahHadithTwentyTwenty_2,
        ElmTextTwenty.ayahHadithTwentyTwenty_3,
      ],
      subtitles: [ElmTextTwenty.subtitleTwentyTwenty_1],
      order: ['texts', 'ayahs', 'texts', 'ayahs', 'subtitles', 'texts', 'ayahs'],
    },
    {
      texts: [
        ElmTextTwenty.elmTextTwentyTwentyOne_1,
        ElmTextTwenty.elmTextTwentyTwentyOne_2,
        ElmTextTwenty.elmTextTwentyTwentyOne_3,
      ],
      ayahs: [ElmTextTwenty.ayahHadithTwentyTwentyOne_1],
      subtitles: [ElmTextTwenty.subtitleTwentyTwentyOne_1],
      order: ['texts', 'ayahs', 'texts', 'subtitles', 'texts'],
    },
    {
      texts: [
        ElmTextTwenty.elmTextTwentyTwentyTwo_1,
        ElmTextTwenty.elmTextTwentyTwentyTwo_2,
      ],
      ayahs: [ElmTextTwenty.ayahHadithTwentyTwentyTwo_1],
      order: ['texts', 'ayahs', 'texts'],
    },
    {
      subtitles: [ElmTextTwenty.subtitleTwentyTwentyThree_1],
      texts: [
        ElmTextTwenty.elmTextTwentyTwentyThree_1,
        ElmTextTwenty.elmTextTwentyTwentyThree_2,
        ElmTextTwenty.elmTextTwentyTwentyThree_3,
      ],
      ayahs: [
        ElmTextTwenty.ayahHadithTwentyTwentyThree_1,
        ElmTextTwenty.ayahHadithTwentyTwentyThree_2,
        ElmTextTwenty.ayahHadithTwentyTwentyThree_3,
      ],
      order: ['subtitles', 'texts', 'ayahs', 'texts', 'ayahs', 'texts', 'ayahs'],
    },
    {
      texts: [
        ElmTextTwenty.elmTextTwentyTwentyFour_1,
        ElmTextTwenty.elmTextTwentyTwentyFour_2,
      ],
      ayahs: [
        ElmTextTwenty.ayahHadithTwentyTwentyFour_1,
        ElmTextTwenty.ayahHadithTwentyTwentyFour_2,
      ],
      order: ['texts', 'ayahs', 'texts', 'ayahs'],
    },
    {
      subtitles: [ElmTextTwenty.subtitleTwentyTwentyFive_1],
      texts: [ElmTextTwenty.elmTextTwentyTwentyFive_2],
      order: ['subtitles', 'texts'],
    },
    {
      ayahs: [
        ElmTextTwenty.ayahHadithTwentyTwentySix_1,
        ElmTextTwenty.ayahHadithTwentyTwentySix_2,
      ],
      texts: [ElmTextTwenty.elmTextTwentyTwentySix_1],
      order: ['ayahs', 'texts', 'ayahs'],
    },
    {
      subtitles: [ElmTextTwenty.subtitleTwentyTwentySeven_1],
      texts: [
        ElmTextTwenty.elmTextTwentyTwentySeven_1,
        ElmTextTwenty.elmTextTwentyTwentySeven_2,
        ElmTextTwenty.elmTextTwentyTwentySeven_3,
      ],
      ayahs: [
        ElmTextTwenty.ayahHadithTwentyTwentySeven_1,
        ElmTextTwenty.ayahHadithTwentyTwentySeven_2,
        ElmTextTwenty.ayahHadithTwentyTwentySeven_3,
      ],
      order: ['subtitles', 'texts', 'ayahs', 'texts', 'ayahs', 'texts', 'ayahs'],
    },
    {
      texts: [
        ElmTextTwenty.elmTextTwentyTwentyEight_1,
        ElmTextTwenty.elmTextTwentyTwentyEight_2,
        ElmTextTwenty.elmTextTwentyTwentyEight_3,
      ],
      ayahs: [
        ElmTextTwenty.ayahHadithTwentyTwentyEight_1,
        ElmTextTwenty.ayahHadithTwentyTwentyEight_2,
        ElmTextTwenty.ayahHadithTwentyTwentyEight_3,
      ],
      order: ['texts', 'ayahs', 'texts', 'ayahs', 'texts', 'ayahs'],
    },
    {
      texts: [
        ElmTextTwenty.elmTextTwentyTwentyNine_1,
        ElmTextTwenty.elmTextTwentyTwentyNine_2,
        ElmTextTwenty.elmTextTwentyTwentyNine_3,
        ElmTextTwenty.elmTextTwentyTwentyNine_4,
        ElmTextTwenty.elmTextTwentyTwentyNine_5,
        ElmTextTwenty.elmTextTwentyTwentyNine_6,
        ElmTextTwenty.elmTextTwentyTwentyNine_7,
        ElmTextTwenty.elmTextTwentyTwentyNine_8,
      ],
      ayahs: [
        ElmTextTwenty.ayahHadithTwentyTwentyNine_1,
        ElmTextTwenty.ayahHadithTwentyTwentyNine_2,
        ElmTextTwenty.ayahHadithTwentyTwentyNine_3,
        ElmTextTwenty.ayahHadithTwentyTwentyNine_4,
        ElmTextTwenty.ayahHadithTwentyTwentyNine_5,
        ElmTextTwenty.ayahHadithTwentyTwentyNine_6,
        ElmTextTwenty.ayahHadithTwentyTwentyNine_7,
        ElmTextTwenty.ayahHadithTwentyTwentyNine_8,
      ],
      order: [
        'texts',
        'ayahs',
        'texts',
        'ayahs',
        'texts',
        'ayahs',
        'texts',
        'ayahs',
        'texts',
        'ayahs',
        'texts',
        'ayahs',
        'texts',
        'ayahs',
        'texts',
        'ayahs',
      ],
    },
    {
      texts: [
        ElmTextTwenty.elmTextTwentyThirty_1,
        ElmTextTwenty.elmTextTwentyThirty_2,
        ElmTextTwenty.elmTextTwentyThirty_3,
      ],
      ayahs: [
        ElmTextTwenty.ayahHadithTwentyThirty_1,
        ElmTextTwenty.ayahHadithTwentyThirty_2,
      ],
      order: ['texts', 'ayahs', 'texts', 'ayahs', 'texts'],
    },
    {
      ayahs: [
        ElmTextTwenty.ayahHadithTwentyThirtyOne_1,
        ElmTextTwenty.ayahHadithTwentyThirtyOne_2,
        ElmTextTwenty.ayahHadithTwentyThirtyOne_3,
      ],
      texts: [
        ElmTextTwenty.elmTextTwentyThirtyOne_1,
        ElmTextTwenty.elmTextTwentyThirtyOne_2,
      ],
      order: ['ayahs', 'texts', 'ayahs', 'texts', 'ayahs'],
    },
    {
      texts: [ElmTextTwenty.elmTextTwentyThertyTwo_1],
      order: ['texts'],
    },
    {
      texts: [
        ElmTextTwenty.elmTextTwentyThirtyThree_1,
        ElmTextTwenty.elmTextTwentyThirtyThree_2,
        ElmTextTwenty.elmTextTwentyThirtyThree_3,
        ElmTextTwenty.elmTextTwentyThirtyThree_4,
      ],
      ayahs: [
        ElmTextTwenty.ayahHadithTwentyThirtyThree_1,
        ElmTextTwenty.ayahHadithTwentyThirtyThree_2,
      ],
      subtitles: [
        ElmTextTwenty.subtitleTwentyThirtyThree_1,
        ElmTextTwenty.subtitleTwentyThirty33_2,
      ],
      order: [
        'texts',
        'ayahs',
        'texts',
        'subtitles',
        'texts',
        'subtitles',
        'ayahs',
        'texts',
      ],
    },
    {
      ayahs: [
        ElmTextTwenty.ayahHadithTwentyThirtyFour_1,
        ElmTextTwenty.ayahHadithTwentyThirtyFour_2,
        ElmTextTwenty.ayahHadithTwentyThirtyFour_3,
      ],
      texts: [
        ElmTextTwenty.elmTextTwentyThirtyFour_1,
        ElmTextTwenty.elmTextTwentyThirtyFour_2,
        ElmTextTwenty.elmTextTwentyThirtyFour_3,
      ],
      order: ['ayahs', 'texts', 'ayahs', 'texts', 'ayahs', 'texts'],
    },
    {
      ayahs: [
        ElmTextTwenty.ayahHadithTwentyThirtyFive_1,
        ElmTextTwenty.ayahHadithTwentyThirtyFive_2,
      ],
      texts: [
        ElmTextTwenty.elmTextTwentyThirtyFive_1,
        ElmTextTwenty.elmTextTwentyThirtyFive_2,
      ],
      order: ['ayahs', 'texts', 'ayahs', 'texts'],
    },
  ];

  // Generate detailedOrder for each item
  const itemsWithDetailedOrder = chapter20Items.map((item) => {
    const detailedOrder = item.order.map((type) => ({
      type,
      index: 0, // Default, will be adjusted based on type count
    }));

    // Adjust indices based on actual content
    const typeCounters = {};
    item.order.forEach((type) => {
      if (!typeCounters[type]) {
        typeCounters[type] = 0;
      }
      const currentIndex = typeCounters[type];
      const lastIndex = detailedOrder.findIndex(
        (d) => d.type === type && d.index === currentIndex
      );
      if (lastIndex !== -1) {
        detailedOrder[lastIndex].index = currentIndex;
      }
      typeCounters[type]++;
    });

    return {
      ...item,
      detailedOrder,
    };
  });

  // Update the data
  data.lists['20'] = itemsWithDetailedOrder;

  // Write back to file
  fs.writeFileSync(
    dataPath,
    JSON.stringify(data, null, 2),
    'utf8'
  );

  console.log('✅ Chapter 20 updated successfully!');
  console.log(`   - ${itemsWithDetailedOrder.length} items added`);
  console.log(`   - Total content blocks: ${itemsWithDetailedOrder.reduce((acc, item) => acc + item.order.length, 0)}`);
}

updateChapter20();
