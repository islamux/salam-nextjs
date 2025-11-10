/**
 * Update Chapter 21 with actual content from converted Dart files
 * This script adds titles, subtitles, texts, and ayahs to Chapter 21
 */

const fs = require('fs');
const path = require('path');

// Chapter 21 Arabic text content (converted from Dart)
const ElmTextTwentyOne = {
  // Page 1
  titleTwentyOneOne: `أوامر الله تكليفية وتكوينية`,
  elmTextTwentyOneOne_1: `(1)
أمره التكليفي: الحقيقة أن المؤمن مكلف أن يصبر عن الشهوات المحرمة، ومكلف أن يصبر على الطاعات، ومكلف أن يصبر على القضاء والقدر، ومكلف أن يصبر على حكم الله، والله عز وجل يُعطي كل إنسان حظوظاً متفاوتة، فأنت حكم الله لك بأن تنجب بنات فقط فهذا حكم الله، وحكم الله لإنسان آخر أن يجعله عقيماً، وحكم لإنسان ثالث أن يكون ذا دخل كبير، ولإنسان رابع ذا دخل محدود، ولإنسان خامس أن يؤدب بهذه الطريقة، فهذا كُله حُكمُ الله، والله عز وجل له أمر تكليفي، وله أمر تكويني`,

  elmTextTwentyOneOne_2: `(2)
أمره التكويني ( أفعاله ) مثلاً: إذا كان هناك خصمان يتخاصمان فقد يربح أحدهما الدعوة على أخيه，但是他 قد يكون ظالماً، وقد يكون أخوه مظلوماً، فحكم الله هنا يأتي مُعاكساً لحكم القاضي، فقد يعوض المظلوم ويبطش بالظالم، فهذا حُكم الله، وأفعال الله هي حكمة، فقد يطلق الزوج زوجته مثلاً، وتكون الزوجة مظلومة في هذا، لذلك كانت حكمة ربنا عزوجل مع الزوجة المظلومة أن يكافئها بزوج يكرمها، وحكم الله مع الزوج الظالم أن يعاقبه بزوجةٍ تكيل له الصاع صاعين، فهذا حكم الله، فحكم الله عز وجل هو أفعاله، فاحياناً يُكرم ويُعلي ويعز، وأحياناً يهين ويذل، وقد يُعطي ويمنع ويشفي ويعافي ويرفع ويخفض ويقبض ويبسط فهذا هو حكم الله..`,
  ayahHadithTwentyOneOne_1: `فاصبر لحكم ربك`,
  elmTextTwentyOneOne_3: `معاني(فاصبر)
(1)
أي إذا كان عندك إكرام فاشكر، وإذا كان هناك شيئ مخالف لرغبتك فاصبر`,
  ayahHadithTwentyOneOne_2: `فاصبر لحكم ربك`,
  elmTextTwentyOneOne_3: `(2)
أي فاصبر للأمر والنهي، فالأمر والنهي يحتاجان إلى صبر، فهما تكليف، والتكليف ذو كلفة

المؤمن الحق في أعلى درجات العناية والحفظ والتأييد
واصبر لحكم ربك فإنك بأعيننا
هذه الآية خاصة بالنبي عليه الصلاة والسلام، ولكل مؤمن نصيبٌ منها على قدر ايمانه، وعلى قدر استقامته، وإخلاصه، فالله عز وجل قال لسيدنا موسى`,

  // Page 2
  ayahHadithTwentyOneTwo_1: `والقيت عليك محبة مني ولتصنع على عيني
واصطنعتك لنفسي
 وقال للنبي عليه الصلاة والسلام
فإنك باعيننا`,
  elmTextTwentyOneTwo_1: `يعني في أعلى درجات العناية، أعلى درجات الحفظ، والرعاية والتأييد، والتوفيق وكل مؤمن مستقيم، محب لله عز وجل، يشعر أن الله معه، وهو في محنته، يشعر أن الله معه، ولن يخيب ظنه، ولن يسلمه لأحد، ولا يتخلى عنه`,
  subtitleTwentyOneTwo_1: `طاعة الله ثمنها التأييد والرعاية والحفظ`,
  ayahHadithTwentyOneTwo_2: `فإنك باعيننا`,

  // Page 3
  elmTextTwentyOneThree_1: `برعايتنا هذا معنى قول الله عز وجل`,
  subtitleTwentyOneThree_1: `إن الله مع المتقين`,
  elmTextTwentyOneThree_2: `قال العلماء: هذه معية خاصة، معية بالتأييد، والنصر، والحفظ والتوفيق`,
  ayahHadithTwentyOneThree_1: `واصبر لحكم ربك`,
  elmTextTwentyOneThree_3: `فالحكم غير واضح، إذ لو كان واضحاً لما احتاج إلى صبر`,
  ayahHadithTwentyOneThree_2: `فاصبر إن العاقبة للمتقين`,
  elmTextTwentyOneThree_4: `رب كريم يقول لك`,
  ayahHadithTwentyOneThree_3: `فاصبر إن العاقبة للمتقين`,

  // Page 4
  elmTextTwentyOneFour_1: `وأنت أيها الأخ الكريم، اصبر على بعدك عن المعصية، واصبر على الطاعة، واصبر على تربية الله لك، أن العاقبة للمتقين يارسول الله ادعُ الله أن يرحمني،成份: يارب ارحمه成份: كيف ارحمه مما ألم به؟ وعزتي وجلالي لا أقبض عبدي المؤمن وأنا أحب أن ارحمهُ إلا ابتليته بكل سيئة كان عملها، سقماً في جسده، أو إقتاراً في رزقه، أو مصيبة في ماله أو ولده، حتى أبلغ منه مثل الذر فإذا بقي عليه شيئٌ شددتُ عليه سكرات الموت حتى يلقاني كيوم ولدتهُ أمه، فاصبر إن العاقبة للمتقين`,
  ayahHadithTwentyOneFour_1: `فاصبر إن العاقبة للمتقين`,
  elmTextTwentyOneFour_2: `والصبر من الإيمان كالرأس من الجسد، فإذا ذهب الصبر ذهب الإيمان، فاصبر إن العاقبة للمتقين`,
  ayahHadithTwentyOneFour_2: `فصبر جميل`,

  // Page 5
  subtitleTwentyOneFive_1: `ماهو الصبر الجميل؟`,
  elmTextTwentyOneFive_1: `ماهو الصبر الجميل؟ الصبر الجميل هو الذي لا ترافقه شكوى إلى الخلق، ويعاب من يشكو الرحيم إلى الذي لا يرحم، الصبر الجميل ألا تشكو إلى أحد شكوتك، إن شكوت إلى كافر فكأنما اشتكيت على الله، وإن شكوت إلى مؤمن فكأنما شكوت إلى الله، وشتان بين من يشتكي على الله ومن يشتكي إلى الله، والصبر الجميل لا شكوى لا إلى مؤمن ولا إلى كافر`,
  ayahHadithTwentyOneFive_1: `إنما اشكو بثي وحزني إلى الله`,
  elmTextTwentyOneFive_2: `لأنك إذا شكوت مصيبتك لمؤمن حزن لحزنك، وهو عبد فقير لا يستطيع أن يفعل شيئاً، وإذا شكوت همك إلى كافر شمت بك، لذلك من الدعاء الشريف`,
  ayahHadithTwentyOneFive_2: `عن أبي هريرة عن النبي صلى الله عليه وسلم قال
تعوذوا بالله من جهد البلاء، ودرك الشقاء، وسؤ القضاء، وشماتة الأعداء(صحيح البخاري)`,
  elmTextTwentyOneFive_3: `والشكوى لغير الله مذلة`,
  ayahHadithTwentyOneFive_3: `قال عبد الله بن شداد:{سمعتُ نشيج عُمر وأنا في آخر الصفوف يقرأ:إنما أشكو بثي وحزني إلى الله} (صحيح البخاري)`,

  // Page 6
  elmTextTwentyOneSix_1: `وكلما ارتفع مستوى الإيمان تجد أن المؤمن يستحيي أن يشكو مصيبته لغير الله، ليكن هذا النبي الكريم أسوة لنا في المصائب`,
  ayahHadithTwentyOneSix_1: `قال عبدُالله بن شداد:{سمعتُ نشيج عُمر وأنا في آخر الصفوف يقرأ: إنما أشكو بثي وحزني إلى الله} (صحيح البخاري)`,
  elmTextTwentyOneSix_2: `هناك أناس إذا ألمت بهم ملمة ملؤوا الدنيا صياحاً وصخباً، ما من أحد يلتقون به إلا ويبثونه شكواهم، يشتكون الزمان، يشكون قلة الدخل، من جلس إلى غني فتضعضع له ذهب ثلثا دينه`,
  ayahHadithTwentyOneSix_2: `فصبر جميل
إذا أحب الله عبداً ابتلاه`,
  elmTextTwentyOneSix_3: `إذا أحب الله عبده ابتلاه، فإن صبر اجتباه، فإن شكر اقتناه، وإذا لم يحبه تركه هملاً، أنت إذا سمعت من طفل في الطريق كلمةنابية لا تقول شيئاً، بل تقول: مالي وله، أما إذا نظرت إلى القائل فإذا هو ابنك، ماذا تفعل؟ تؤدبه تأديباً شديداً، تقيم قيامته، لماذا فعلت به مافعلت؟ من شدة حبك له وحرصك عليه، فلذلك الذي يحبه الله سبحانه وتعالى يعالجه، إذا اراد الله بعبده خيراً عجل له بالعقاب، إذا أراد الله بعبد خيراً عاتبه في منامه، فهذا الذي يتابعه الله سبحانه وتعالى على كل ذنب، يتابعه على كل تقصير، يتابعه على كل خروج عن طريق الحق، ليفرح لأن الله يحبه، عن محمود بن لبيد أن النبي صلى الله عليه وسلم قال
إذا احب الله قوماً ابتلاهم فمن صبر فله الصبر، ومن جزع فله الجزع
فاصبر على ما يقولون`,

  // Page 7
  ayahHadithTwentyOneSeven_1: `ماعند الله لا يُنال إلا بعد امتحان`,
  elmTextTwentyOneSeven_1: `في هذه الآية حقيقة أساسية، وهي أن ماعند الله سبحانه وتعالى لا يمكن أن ينال إلا بعد امتحان، ومن لوازم الإمتحان أنه شديد، وهذا العطاء الكبير لن يُنال والإنسان في بحبوحة، وكما يشتهي، فلا بد من امتحان`,
  ayahHadithTwentyOneSeven_2: `أم حسبتم ان تدخلوا الجنة ولما يعلم الله الذين جاهدوا منكم ويعلم الصابرين
أحسب الناس أن يتركوا أن يقولوا آمنا وهم لا يفتنون`,
  elmTextTwentyOneSeven_2: `وحينما دعا الله سبحانه وتعالى نبيه إلى الصبر، فقد كان من الممكن أن يخلق الله النبي وأصحابه الكرام من دون أعداء، وهؤلاء الأعداء الكفار الفجار المعارضين الذين كادوا للنبي عليه الصلاة والسلام، كان من الممكن أن يأتي بهم قبل بعثة النبي أو بعدها بكثير، ولكن العبرة أن النبي عليه الصلاة والسلام قدوة لكل مؤمن، فيجب أن يتحمل المتاعب، حتى تكون سيرته قدوة لنا، ومثلاً أعلى يحتذى`,
  ayahHadithTwentyOneSeven_3: `لقد جاءكم رسول من انفسكم`,

  // Page 8
  elmTextTwentyOneEight_1: `إن الله سبحانه وتعالى عصم النبي عليه الصلاة والسلام من أن يناله المشركين بالقتل لئلا تغتال الدعوة باغتياله، ولكن لم يعصمه عن إيقاع الأذى الذي تحمله أيما تحمل وصبر له أيما صبر، ولذلك ربنا سبحانه وتعالى يقول`,
  ayahHadithTwentyOneEight_1: `واصبر كما صبر أولو العزم من الرسل
فاصبر على مايقولون`,
  elmTextTwentyOneEight_2: `أي إذا عارضك إنسان، وسفه دعوتك إنسان، واستخف بك فلك أسوةٌ حسنة بهذا النبي العدنان`,
  ayahHadithTwentyOneEight_2: `فاصبر إن وعد الله حق`,
  elmTextTwentyOneEight_3: `العلماء حينما فسروا قوله تعالى`,
  ayahHadithTwentyOneEight_3: `الم تر كيف فعل ربك بأصحاب الفيل`,
  elmTextTwentyOneEight_4: `( الم تر )
بماذا اجاب المفسرون؟ أجابوا بأن خبر الله لشدة أحقيته ووثوقه وصدقه كأنك تراه، وفضيلة العلامة الدكتور محمد راتب النابلسي يقول وانا بدوري أقيس على هذه الفكرة أن وعد الله لأحقية وقوعه كأنه وقع والدليل`,

  // Page 9
  ayahHadithTwentyOneNine_1: `( الم تر )`,
  elmTextTwentyOneNine_1: `بماذا اجاب المفسرون؟ أجابوا بأن خبر الله لشدة أحقيته ووثوقه وصدقه كأنك تراه، وفضيلة العلامة الدكتور محمد راتب النابلسي يقول وانا بدوري أقيس على هذه الفكرة أن وعد الله لأحقية وقوعه كأنه وقع والدليل`,
  ayahHadithTwentyOneNine_2: `أتى امر الله فلا تستعجلوه`,
  elmTextTwentyOneNine_2: `معنى هذا أنه لم يأت بعد، انظر التعبير القرآني`,
  ayahHadithTwentyOneNine_3: `اتى امر الله فلا تستعجلوه`,
  elmTextTwentyOneNine_3: `المعنى أنه ما أتى، تعرف ذلك من قوله تعالى`,
  ayahHadithTwentyOneNine_4: `فلا تستعجلوه`,
  elmTextTwentyOneNine_4: `هو قال`,
  ayahHadithTwentyOneNine_5: `( اتى )`,
  elmTextTwentyOneNine_5: `عبر عما يحدث بالمستقبل بالفعل الماضي تحقيقاً لوقوعه
إذاً ربنا عز وجل قال`,

  // Page 10
  ayahHadithTwentyOneTen_1: `فاصبر إن وعد الله حق`,
  elmTextTwentyOneTen_1: `لذلك أحد الصحابة قال: {والله لو كشف الغطاء ما ازددت يقيناً} أي أن يقينه بوعد الله قبل كشف الغطاء كيقينه بعد كشف الغطاء
صحابي آخر قال:{والله لو علمت أن غداً أجلي ماقدرت أن أزيد في عملي} أي أنه استنفذ طاقته في الطاعة، وإخواننا السائقون يقولون_العداد مغلق_ هذه أقصى سرعة ينطلق بها، فهذا هو المؤمن الذي يستحق وعد الله عز وجل، ويستحق النصر والتأييد، فنحن نجد المساجد مليئة، أما البيوت فليست إسلامية، والأسواق غصت بالضلالات، ونساءٌ كاسيات عاريات، وعمت تلك الأسواق الأيمان الكاذبة التي تدك الآذان، جعلها أصحاب المحلات فخاخاً لاغتنام الأرباح
عن أبي هريرة رضي الله عنهُ قال سمعت رسول الله صلى الله عليه وسلم يقول
الحلف منفقة للسلعة ممحقة للبركة
فيها التدليس، فيها الكذب، فيها الغش، فيها بيع لا يرضي الله عز وجل، فيها بيع يشبه الربا، هذه أسواقنا، وهذه بيوتنا، فإذا كنت قد قرأت في القرآن وعداً للمؤمنين بالحفظ، ولم تجد هذا الحفظ، قرأت وعداً للمؤمنين بالتوفيق، وما وجدت التوفيق، فالقضية بسيطة جداً، عليك أن تشك بالموعود لا بالوعد، هذه فكرة دقيقة صائبة`,
  ayahHadithTwentyOneTen_2: `فاصبر إن وعد الله حق`,

  // Page 11
  elmTextTwentyOneEleven_1: `معنى حق أي أنه لابد من أن يقع، وزوال الكون أهون على الله من أن لا يقع
من عمل صالحاً من ذكر أو انثى وهو مؤمن فلنحيينه حياة طيبة
هذا وعد إلهي لكل مؤمن، هذه الآية لا علاقة لها بالظروف المستجدة، لا علاقة لها بالأزمات، لا علاقة لها بالفقر، لا علاقة لها بالضعف، لا علاقة لها بالمرض، إنه وعد إلهي`,
  ayahHadithTwentyOneEleven_1: `فاصبر إن وعد الله حق`,
  elmTextTwentyOneEleven_2: `أحياناً يكون المؤمن ضعيفاً مستضعفاً، وأحياناً يكون فقيراً، وأحياناً يكون من الطبقة الدنيا في المجتمع، أما انت أيها الضال فأنت المتفوق، وأنت الرابح، وأنت الفائز، وأنت الناجح، وأنت السعيد، وأنت الملك ولكن`,
  ayahHadithTwentyOneEleven_2: `فاصبر إن وعد الله حق`,
  elmTextTwentyOneEleven_3: `وعد المؤمن بالنصر، وعد المؤمن بالتأييد، وعده بالتوفيق، وعده بالسعادة، وعدهُ بالعفو، وعدهُ بالمغفرة، وعدهُ بجنةٍ عرضها السماوات والأرض، وعده بقبر روضة من رياض الجنة، وقد يكون حفرة من حفر النيران لمن ضل أو كفر`,
  ayahHadithTwentyOneEleven_3: `فاصبر إن وعد الله حق فإما نرينك بعض الذي نعدهم أو نتوفينك فإلينا يُرجعون`,

  // Page 12
  elmTextTwentyOneTwelve_1: `أي إن رأيت مصيرهم في الدنيا أو لم تر فلا بد من أن يلقوا المصير المؤلم`,
  subtitleTwentyOneTwelve_1: `الصبر وانواعه`,
  elmTextTwentyOneTwelve_2: `صبر القهر
صبر الشكر
الصبر المحمود`,
  ayahHadithTwentyOneTwelve_1: `ولربك فاصبر`,
  elmTextTwentyOneTwelve_3: `الإنسان أحياناً يكون ضعيفاً فيصبر أمام القوي، يكون فقيراً فيصبر أمام الغني، ليس هذا هو الصبر المحمود، الصبر المحمود أن تكون في أعلى درجات القوة، وفي أعلى درجات الغنى وأنت صابر لله وحده، مقيدك خوفك من الله، مقيدك تواضعك لله، هذا الصبر المحمود
أحياناً الإنسان يسكت(لا أستطيع التكلم) طبعاً لا تستطيع أن تتكلم لأنك ضعيف وخصمك قوي، ليس هذا هو الصبر المحمود، الصبر المحمود أن تكون قوياً وأن تضبط سلوكك، الإنسان غضب من خادم عنده قال: ياسيدي والكاظمين الغيظ، قال: كظمت غيظي، قال: والعافين عن الناس، قال: عفوت عنك، قال: والله يحب المحسنين، قال: أنت حرٌ لوجه الله، يعني أن تكون قوياً وأن تصبر، أن تكون غنياً وأن تصبر، فهذا الصبر المحمود`,
  ayahHadithTwentyOneTwelve_2: `ولربك فاصبر`,

  // Page 13
  ayahHadithTwentyOneThirteen_1: `القضاء وأنواعه`,
  elmTextTwentyOneThirteen_1: `القضاء المحمود
العلماء قالوا لسيدك ومالك فاصبر على أداء فرائضه وعباداته
وقال مجاهد: اصبر على ما أذيت
وقال ابن زيد: حملت أمراً عظيماً فاصبر عليه
وقيل أصبر على مكاره القضاء
يوجد مكروه القضاء، ويوجد محمود القضاء، إذا إنسان صحته طيبة والله بعث له مال وفير فإن هذا محمود القضاء

القضاء المكروه
أما أصابه مرض لاسمح الله، أصابه فقر، أصابه مشكلة، سيدنا علي قال: الرضا بمكروه القضاء أرفع درجات اليقين

اصبر على البلوى لأن الله يمتحن أصفياءه وأولياءه، اصبر على أوامره ونواهيه، وقيل: اصبر على فراق الأهل والأوطان في الهجره`,
  ayahHadithTwentyOneThirteen_2: `ولربك فاصبر`,

  // Page 14
  subtitleTwentyOneFourteen_1: `الأيمان هو الصبر`,
  elmTextTwentyOneFourteen_1: `وبشكل مختصر اصبر على الطاعة، واصبر على المعصية واصبر على قضاء الله وقدره، ثلاثة أنواع اساسيات، اصبر على الطاعة{على مشقة الطاعة}
واصبر عن المعصية{إغراء المعصية}
اصبر على مشقة الطاعة، واصبر عن إغراء المعصية، واصبر على قضاء الله وقدره لأن الأيمان في الأساس صبر
الأيمان انضباط والانضباط صبر، والصبر ثمن الجنة
وفي حديث`,
  ayahHadithTwentyOneFourteen_1: `(الايمان هو الصبر)`,
  elmTextTwentyOneFourteen_2: `الإنسان يضبط أموره كلها بالصبر، يصبر فيغض بصره، يصبر فيظبط لسانه، يصبر فيضبط يده، يصبر فيضبط رجله، فهذا هو الصبر`,
  ayahHadithTwentyOneFourteen_2: `ولمن صبر وغفر إن ذلك لمن عزم الأمور`,

  // Page 15
  elmTextTwentyOneFifteen_1: `أحياناً يأتي القضاء والقدر مباشرةً من الله مثلاً: شخص وقع ابنه من الشرفة فمات، فلمن يتجه الأب؟ وسوف يحاكم من؟ وسينتقم ممن؟ ويقيم دعوى على من؟ لا يوجد أحد، ابنه وقع من الشرفة إلى الأرض فمات، ولكن حينما يُدهس سائق سيارة ولداً، فبالحالتين الابن مات ولكن مرة مات قضاءً وقدراً ومرة مات بفعل بشري، فالإنسان عندما يكون إيمانه بالله قوياً جداً، وتوحيده قوياً جداً ولو أن الفعل المؤلم جاءه على يد إنسان فيبقى موحداً ويبقى مؤمناً وإن الله وحده هو الذي شاء ذلك، ولذلك فليس عنده حقدٌ دفين على هذا الذي جرى على يده هذا العمل`,
  subtitleTwentyOneFifteen_1: `من صبر على قضاء الله وقدره فأجره على الله`,
  elmTextTwentyOneFifteen_2: `الآية الكريمة`,
  ayahHadithTwentyOneFifteen_1: `ولمن صبر`,
  elmTextTwentyOneFifteen_3: `على قضاء الله وقدره`,

  // Page 16
  ayahHadithTwentyOneSixteen_1: `وغفر`,
  elmTextTwentyOneSixteen_1: `لمن كانت هذه الإساءة على يديه، قال`,
  ayahHadithTwentyOneSixteen_2: `إن ذلك لمن عزم الأمور`,
  elmTextTwentyOneSixteen_2: `إن يحتاج إلى إيمان قوي وإلى توحيد قوي

من عاقب المذنب أو عفا عنه عليه أن يرى أن الله وحده هو الذي سمح له أن يفعل هذا
أما هذه الأية`,
  ayahHadithTwentyOneSixteen_3: `ولمن صبر وغفر إن ذلك لمن عزم الأمور`,
  elmTextTwentyOneSixteen_3: `لذلك المؤمن لو جاءه مكروهٌ على يد إنسان يرى أن الله وحده هو الذي سمح له أن يفعل هذا وتبقى علاقته مع الله، ويقف من هذا الذي ساق الله على يده الشر موقفاً حكيماً، إما أن يعاقبه لمصلحته، وإما أن يعفو عنه但是 بالحالتين ليس في قلبه حقدٌ عليه
إنسان تلقى ضربة من العصا فهل ألمه من العصا أم من الذي ضرب؟ بل من الضارب، فإذا صب كل نقمته على العصا يكون جاهلاً، وعليه أن يتألم ممن ضرب لا من العصا لأنها أداة، وينبغي أن تعلم أن كل البشر الذين يُخاف منهم إنهم عصيٌ بيد الله، والدليل
فكيدوني جميعاً ثم لا تنظرون إني توكلت على الله ربي وربكم مامن دابة الا هو آخذٌ بناصيتها إن ربي على صراطٍ مستقيم`,

  // Page 17
  elmTextTwentyOneSeventeen_1: `الإيمان الكامل أن تقف موقفاً حكيماً من دون حقد ولا إشراك بالله ممن تلقيت منه الأذى

الإيمان الكامل حتى لو جاءك لا سمح الله شر على يد إنسان، فهذا الإنسان لا يستطيع أن يفعل ما فعل إلا بعد أن يأذن الله، وهذا الإنسان سيحاسب ولكن شاءت حكمة الله أن يكون الأذى على يده، إذاً يجب أن تقف موقفاً حكيماً من دون حقد، ولا إشراك بالله، فمع التوحيد الكامل تقف الموقف الكامل، فإن كانت الحكمة أن تعاقبه لتردعه عن أن يعود لمثلها فلا مانع但是 بالحالتين بدون حقد`,
  ayahHadithTwentyOneSeventeen_1: `ياايها الذين امنوا اصبروا وصابرة`,
  subtitleTwentyOnSeventeen_1: `الحكمة من بدء الآية بالنداء بلفظ الإيمان`,
  elmTextTwentyOneSeventeen_2: `أية آية تبدأ بقوله تعالى`,
  ayahHadithTwentyOneSeventeen_2: `ياأيها الذين امنوا`,
  elmTextTwentyOneSeventeen_3: `أي إنكم أيها المؤمنون مرتبطون مع الله بعقد إيماني، أنتم آمنتم به موجوداً وواحداً وكاملاً
أمنتم به خالقاً ومربياً ومسيراً، آمنتم بأسمائه الحسنى وصفاته الفضلى، آمنتم أن الأمر كله بيده، وأن كماله كمال مطلق، وأن حكمته لا حكمة بعدها، ورحمته، وقدرته، وعدله بحسب إيمانكم، ومعرفتكم افعلوا كذا اصبروا`,

  // Page 18
  elmTextTwentyOneEighteen_1: `الأمر بالصبر
ما من آية يحتاجها المسلمون في هذه الآيام الدقيقة التي يمر بها المسلمون في ظرف أصعب من هذه الظرف هم في أمس الحاجة إلى هذه الآية`,
  ayahHadithTwentyOneEighteen_1: `ياأيها الذين آمنوا اصبروا
يقول الله عز وجل
وإن تصبروا وتتقوا لا يضركم كيدهم شيئا`,
  elmTextTwentyOneEighteen_2: `وقد مكروا مكرهم وعند الله مكرهم وإن كان مكرهم لتزول منه الجبال
خالق الأكوان يقول`,
  ayahHadithTwentyOneEighteen_2: `وإن كان مكرهم لتزول منه الجبال`,
  elmTextTwentyOneEighteen_3: `ومع ذلك`,
  ayahHadithTwentyOneEighteen_3: `وإن تصبروا وتتقوا لا يضركم كيدهم شيئا`,

  // Page 19
  elmTextTwentyOneNineteen_1: `كل ماتتصورون من قوة، ومن تقنية، ومن تفوق تزول إذا آمنا وصبرنا، وأعددنا مانستطيع من قوة، أعددنا الإيمان الذي يحملنا على طاعة الله، هذا هو الحل ولا حل سواه`,
  ayahHadithTwentyOneNineteen_1: `ياايها الذين امنوا اصبروا`,
  subtitleTwentyOneNineteen_1: `أصبر على الطاعة وعن المعصية وعلى قضاء الله وقدره`,
  elmTextTwentyOneNineteen_2: `ينبغي أن تصبر على طاعة الله، وعن معصيةالله، وأن تصبر على قضاء الله وقدره`,
  ayahHadithTwentyOneNineteen_2: `ياايها الذين امنوا اصبروا`,
  elmTextTwentyOneNineteen_3: `أمر إلهي، وحينما يكون الأمر واضحاً وضوح الشمس، لكن متى تصبر؟ حينما تختلط الأمور، وحينما تضيع القضية، وحينما لا يتضح الأمر فأنت مأمور أن تصبر على حكم الله، وعلى طاعة الله، وعن معصيته`,
  ayahHadithTwentyOneNineteen_3: `ياايها الذين امنوا اصبروا`,

  // Page 20
  elmTextTwentyOneTwenty_1: `آية في كتاب الله إذا قرأتها يقشعر لها الجلد، ربنا يحدثنا عن أحد أنبيائه العظام قال`,
  ayahHadithTwentyOneTwenty_1: `إنا وجدناه صابراً نعم العبد إنه اواب`,
  elmTextTwentyOneTwenty_2: `وتكلم عن نبي أخر成份:
واما إبراهيم الذي وفى`,
  elmTextTwentyOneTwenty_2: `وابراهيم الذي وفى`,
  elmTextTwentyOneTwenty_3: `وفى ماعليه، وفى نعمة الله شكراً، ومنهج الله طاعة، وفى الله ذكراً ومعرفة`,
  ayahHadithTwentyOneTwenty_3: `ياايها الذين امنوا اصبروا`,
  elmTextTwentyOneTwenty_4: `لنصبر على مكر أعدائنا، وعلى شظف العيش أحياناً، ربما لا تدوم النعم، وقد يأتي ظرف صعب، وربما لا يتاح لنا أن نعيش كما كنا نعيش، لأنك مؤمن، ولأن الإيمان أكبر قضية في حياتك، فينبغي أن تصبر`,
  ayahHadithTwentyOneTwenty_4: `ياايها الذين امنوا اصبروا`,

  // Page 21
  subtitleTwentyOneTwentyOne_1: `الصبر هو الإيمان`,
  elmTextTwentyOneTwentyOne_1: `والصبر نصف الإيمان، بل هو الإيمان كله، الطاعة صبر، وغض البصر صبر، أن تنطق بالحق صبر، من السهل جداً أن تنطق بكلام يرضي الأقوياء فتنعم بالأمن عندهم، لكنك إذا تكلمت كلاماً يزعجهم فقدت الأمن عندهم، فقد يكون النطق بالحق صبر، وقد يكون التحرك في كسب المال صبر، لأن أبواب الربا مفتحة على مصاريعها`,
  ayahHadithTwentyOneTwentyOne_1: `ياايها الذين امنوا اصبروا وصابرة`,
  elmTextTwentyOneTwentyOne_2: `معنى صابرة
المعنى الذي يمكن أن يستنبط من كلمة وصابروا
أي احملوا من حولكم على الصبر، اصبر وصابر أحياناً الإنسان من غير حكمة يشكو لك مشكلة، والله مشكلتك صعبة لا تحتمل، الله يعينك، ليس هذا هو الموقف الكامل، ينبغي أن تخفف عنه، وتهون في عينه الدنيا، وأن تطمعه في الآخرة، وأن تشعره أن معظم الناس يعانون مايعانون، فأنت ينبغي أن تصبر، وينبغي أن تحمل غيرك على الصبر، ينبغي أن تصبر، وتبين حكمة الله التي ينبغي أن نصبر عليها، ينبغي أن تصبر، وتبين ماذا ينتظر الصابرون`,
  subtitleTwentyOneTwentyOne_2: `الصبر: أجره بغير حساب`,
  elmTextTwentyOneTwentyOne_3: `الحقيقة: دائماً لكل عمل صالح أجر من ضعف إلى عشرة أضعاف إلى سبعمائة ضعف إلا الصبر`,
  ayahHadithTwentyOneTwentyOne_2: `إنما يوفى الصابرون أجرهم بغير حساب`,

  // Page 22
  elmTextTwentyOneTwentyTwo_1: `يمكن أن نعطيك أمر دفع بمائة بمليون، أما إذا وقعنا لك هذا الأمر، وقلنا لك: اكتب الرقم الذي تريد، هذا مفتوح، هكذا عطاء الصابرين`,
  ayahHadithTwentyOneTwentyTwo_1: `إنما يوفى الصابرون أجرهم بغير حساب`,
  elmTextTwentyOneTwentyTwo_2: `هُناك إمرأة صابرة على زوج شرس، هناك شريك صابر على شريك متعب، هناك ابن صابر لأب صعب المعاملة، هناك أب يصبر على ابنه، هناك من يصبر على الآخرين، يصبر ابتغاء وجه الله`,
  ayahHadithTwentyOneTwentyTwo_2: `ياايها الذين امنوا اصبروا وصابرة`,
  elmTextTwentyOneTwentyTwo_3: `احملوا غيركم على الصبر، اصبر وصابر، اصبر، وانتظر من الله الفرج، اصبر واعلم علم اليقين أن الله يحب الصابرين، اصبر، واعلم أن الله مع الصابرين، اصبر، واعلم أن الله سيجزي الصابرين بغير حساب`,

  // Page 23 - وقفة
  titleTwentyOneTwentyThree: `وقفة
--------`,
  subtitleTwentyOneTwentyThree_1: `الإنسان حينما يتصل بالله يستطيع أن يواجه أعداء الحق`,
  ayahHadithTwentyOneTwentyThree_1: `فاصبر على مايقولون وسبح بحمد ربك قبل طلوع الشمس وقبل الغروب`,
  elmTextTwentyOneTwentyThree_1: `دائماً وفي أغلب الأحيان يأتي الصبر مع التسبيح، ما الذي يعينك على كلام هؤلاء الجهلة`,
  ayahHadithTwentyOneTwentyThree_2: `فاصبر على مايقولون وسبح بحمد ربك`,
  elmTextTwentyOneTwentyThree_2: `لما يكون الإنسان في ضيق مادي، أو ضيق معنوي، أو حوله أناس أعداء منكرون، مفندون، إن كان له صلة بالله فهذه الصلة تغنيه عن صداقتهم، وتغنيه عن الإستماع إليهم، والحقيقة أن الإنسان حينما يتصل بالله يستطيع عندئذٍ أن يواجه أعداء الحق، لأن معه ذخيرة، ومعه سلاح، والاتصال بالله مُسعد، لذلك الإنسان الفارغ لا يحتمل المعارضة، ولا يحتمل النقد، ولا يحتمل التخويف، هو ضعيف في الأساس، أما حينما يقوى بالله عز وجل يصبح أقوى من كل قوةٍ تريد أن تنال منه`,

  // Page 24 - وقفة 2
  ayahHadithTwentyOneTwentyFour_1: `يا ايها الذين امنوا أستعينوا بالصبر والصلاة`,
  elmTextTwentyOneTwentyFour_1: `الصبر صبر، أما الصلاة إقبال، فإذا حرمت الدنيا ووصلت إلى الله، هذا الوصول ينسيك كل الدنيا، استعن بالصبر، الصبر سلبي، ولكن أداء الصلاة إيجابي، أنت حرمت نفسك من هذا الكأس، لكن هناك شراباً أطيب، تركت شيئاً لله فجاءك خيرٌ منه`,

  // Page 25 - وقفة 3
  ayahHadithTwentyOneTwentyFive_1: `(إن الله مع الصابرين)`,
  elmTextTwentyOneTwentyFive_1: `هذه معيةخاصة؛ معهم بالنصر، والتأييد، والحفظ، والتوفيق، هذا الذي يصبر يعرف الله، الصبر معرفة، تماماً كما لو جلس إنسان على كرسي طبيب الأسنان، وكان إنساناً بالغاً عاقلاً راشداً، وعنده مشكلة بقلبه لاتسمح للطبيب أن يعطيه مخدراً، أبلغه ذلك، سوف يقلع هذا السن، وهناك ألم شديد، ولكن التخدير يؤذي قلبه، فلأن هذا المريض عاقل، وراشد، ويعرف مصلحته، يثق بالطبيب، تحمل هذا الألم، فالتحمل دليل معرفة، فمعنى الصبر أنك تعرف الله، تعرف حكمته، وتعرف رحمته، وتعرف عدله، وتعرف أنه ليس في الإمكان أبدع مما كان، لهذا تصبر`,

  // Page 26 - وقفة 4
  ayahHadithTwentyOneTwentySix_1: `فاصبر لحكم ربك ولا تطع منهم آثماً أو كفورا واذكر اسم ربك بكرة واصيلا`,
  subtitleTwentyOneTwentySix_1: `علاقة الصبر بالذكر`,
  elmTextTwentyOneTwentySix_1: `هل هناك من علاقة بين الصبر والذكر؟

الصبر سلبي، أما الذكر إيجابي، لو أن الإنسان صبر ولم يذكر اختل توازنه فالذكر هو البديل، والإنسان مفطور على حب الخير، مفطور على حب الجمال، مفطور على حب النوال، فالإنسان يحتاج إلى إيجابيات فإذا صبر عن الشهوات التي حرمها الله عز وجل لابد من البديل، لابد من بديل جمالي، لابد من بديل إيجابي، لابد من بديل ينسيك الذي تركت من أجل الله، إنه ذكر الله
عندما يستقيم الإنسان ويضعف ذكره تصبح استقامته عبئاً عليه، عندما يستقيم ولا يذكر الله إلا قليلا يرى الاستقامة عبئاً لا يحتمل، لأنه سلبيات، ترك هذه، وترك هذه، وترك هذه، إذاً ما الإيجابيات؟ هذا الطعام ممنوع، هذا الطعام ممنوع، هذا الطعام ممنوع، إذاً بقي بلا طعام، لا بد من طعام نفيس ينسيه هذا الذي تركه، فدائماً صبر وذكر، الصبر سلبي
ذكرنا سابقاً أن الإنسان عليه أن يصبر على الطاعات، فالطاعات فيها جهد وتكاليف، وعليه أن يصبر على الشهوات، وعليه أن يصبر على قضاء الله وقدره، أما ما البديل؟ البديل الأنس بالله
المنظر الجمالي لأهل الدنيا، المال، الطعام، النساء، الأماكن الجميلة، السيارات، البيوت، إذاً عندما الإنسان المؤمن يدع أشياء كثيرة لوجه الله لابد من مصدر جمالي يسعده، إنه ذكر الله، اصبر واذكر، دع هذا وخذ هذا، أما دع ولا تأخذ، اختل توازنه الإنسان، فالإنسان سعادته بذكر الله

البديل الإيجابي
لذلك قالوا: في الدنيا جنة من لم يدخلها لم يدخل جنة الآخرة، إنها جنة القرب، أحد العلماء قال: بستاني في صدري ماذا يفعل أعدائي بي؟ إن ابعدوني فإبعادي سياحة، وإن حبسوني فحبسي خلوة، وإن قتلوني فقتلي شهادة`,
  ayahHadithTwentyOneTwentySix_2: `وقال بعض شراح الحديث: حينما قال عليه الصلاة والسلام
(ابو بكر في الجنة)
أي في جنة القرب`,
};

function updateChapter21() {
  const dataPath = path.join(__dirname, '..', 'public', 'khwater-data.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  const chapter21Items = [
    // Page 1
    {
      titles: [ElmTextTwentyOne.titleTwentyOneOne],
      texts: [
        ElmTextTwentyOne.elmTextTwentyOneOne_1,
        ElmTextTwentyOne.elmTextTwentyOneOne_2,
        ElmTextTwentyOne.elmTextTwentyOneOne_3,
      ],
      ayahs: [
        ElmTextTwentyOne.ayahHadithTwentyOneOne_1,
        ElmTextTwentyOne.ayahHadithTwentyOneOne_2,
      ],
      order: ['titles', 'texts', 'ayahs', 'texts', 'ayahs', 'texts'],
    },
    // Page 2
    {
      ayahs: [
        ElmTextTwentyOne.ayahHadithTwentyOneTwo_1,
        ElmTextTwentyOne.ayahHadithTwentyOneTwo_2,
      ],
      texts: [ElmTextTwentyOne.elmTextTwentyOneTwo_1],
      subtitles: [ElmTextTwentyOne.subtitleTwentyOneTwo_1],
      order: ['ayahs', 'texts', 'subtitles', 'ayahs'],
    },
    // Page 3
    {
      ayahs: [
        ElmTextTwentyOne.ayahHadithTwentyOneThree_1,
        ElmTextTwentyOne.ayahHadithTwentyOneThree_2,
        ElmTextTwentyOne.ayahHadithTwentyOneThree_3,
      ],
      subtitles: [ElmTextTwentyOne.subtitleTwentyOneThree_1],
      texts: [
        ElmTextTwentyOne.elmTextTwentyOneThree_1,
        ElmTextTwentyOne.elmTextTwentyOneThree_2,
        ElmTextTwentyOne.elmTextTwentyOneThree_3,
        ElmTextTwentyOne.elmTextTwentyOneThree_4,
      ],
      order: [
        'texts',
        'subtitles',
        'texts',
        'ayahs',
        'texts',
        'ayahs',
        'texts',
        'ayahs',
      ],
    },
    // Page 4
    {
      texts: [
        ElmTextTwentyOne.elmTextTwentyOneFour_1,
        ElmTextTwentyOne.elmTextTwentyOneFour_2,
      ],
      ayahs: [
        ElmTextTwentyOne.ayahHadithTwentyOneFour_1,
        ElmTextTwentyOne.ayahHadithTwentyOneFour_2,
      ],
      order: ['texts', 'ayahs', 'texts', 'ayahs'],
    },
    // Page 5
    {
      subtitles: [ElmTextTwentyOne.subtitleTwentyOneFive_1],
      texts: [
        ElmTextTwentyOne.elmTextTwentyOneFive_1,
        ElmTextTwentyOne.elmTextTwentyOneFive_2,
        ElmTextTwentyOne.elmTextTwentyOneFive_3,
      ],
      ayahs: [
        ElmTextTwentyOne.ayahHadithTwentyOneFive_1,
        ElmTextTwentyOne.ayahHadithTwentyOneFive_2,
        ElmTextTwentyOne.ayahHadithTwentyOneFive_3,
      ],
      order: ['subtitles', 'texts', 'ayahs', 'texts', 'ayahs', 'texts', 'ayahs'],
    },
    // Page 6
    {
      texts: [
        ElmTextTwentyOne.elmTextTwentyOneSix_1,
        ElmTextTwentyOne.elmTextTwentyOneSix_2,
        ElmTextTwentyOne.elmTextTwentyOneSix_3,
      ],
      ayahs: [
        ElmTextTwentyOne.ayahHadithTwentyOneSix_1,
        ElmTextTwentyOne.ayahHadithTwentyOneSix_2,
      ],
      order: ['texts', 'ayahs', 'texts', 'ayahs', 'texts'],
    },
    // Page 7
    {
      ayahs: [
        ElmTextTwentyOne.ayahHadithTwentyOneSeven_1,
        ElmTextTwentyOne.ayahHadithTwentyOneSeven_2,
        ElmTextTwentyOne.ayahHadithTwentyOneSeven_3,
      ],
      texts: [
        ElmTextTwentyOne.elmTextTwentyOneSeven_1,
        ElmTextTwentyOne.elmTextTwentyOneSeven_2,
      ],
      order: ['ayahs', 'texts', 'ayahs', 'texts', 'ayahs'],
    },
    // Page 8
    {
      texts: [ElmTextTwentyOne.elmTextTwentyOneEight_1],
      ayahs: [
        ElmTextTwentyOne.ayahHadithTwentyOneEight_1,
        ElmTextTwentyOne.ayahHadithTwentyOneEight_2,
      ],
      order: ['texts', 'ayahs', 'texts', 'ayahs'],
    },
    // Page 9
    {
      ayahs: [
        ElmTextTwentyOne.ayahHadithTwentyOneNine_1,
        ElmTextTwentyOne.ayahHadithTwentyOneNine_2,
        ElmTextTwentyOne.ayahHadithTwentyOneNine_3,
        ElmTextTwentyOne.ayahHadithTwentyOneNine_4,
        ElmTextTwentyOne.ayahHadithTwentyOneNine_5,
      ],
      texts: [
        ElmTextTwentyOne.elmTextTwentyOneNine_1,
        ElmTextTwentyOne.elmTextTwentyOneNine_2,
        ElmTextTwentyOne.elmTextTwentyOneNine_3,
        ElmTextTwentyOne.elmTextTwentyOneNine_4,
        ElmTextTwentyOne.elmTextTwentyOneNine_5,
      ],
      order: ['ayahs', 'texts', 'ayahs', 'texts', 'ayahs', 'texts', 'ayahs', 'texts', 'ayahs', 'texts'],
    },
    // Page 10
    {
      ayahs: [ElmTextTwentyOne.ayahHadithTwentyOneTen_1],
      texts: [ElmTextTwentyOne.elmTextTwentyOneTen_1],
      order: ['ayahs', 'texts', 'ayahs'],
    },
    // Page 11
    {
      texts: [
        ElmTextTwentyOne.elmTextTwentyOneEleven_1,
        ElmTextTwentyOne.elmTextTwentyOneEleven_2,
        ElmTextTwentyOne.elmTextTwentyOneEleven_3,
      ],
      ayahs: [
        ElmTextTwentyOne.ayahHadithTwentyOneEleven_1,
        ElmTextTwentyOne.ayahHadithTwentyOneEleven_2,
        ElmTextTwentyOne.ayahHadithTwentyOneEleven_3,
      ],
      order: ['texts', 'ayahs', 'texts', 'ayahs', 'texts', 'ayahs'],
    },
    // Page 12
    {
      texts: [ElmTextTwentyOne.elmTextTwentyOneTwelve_1],
      subtitles: [ElmTextTwentyOne.subtitleTwentyOneTwelve_1],
      texts: [
        ElmTextTwentyOne.elmTextTwentyOneTwelve_2,
        ElmTextTwentyOne.elmTextTwentyOneTwelve_3,
      ],
      ayahs: [
        ElmTextTwentyOne.ayahHadithTwentyOneTwelve_1,
        ElmTextTwentyOne.ayahHadithTwentyOneTwelve_2,
      ],
      order: ['texts', 'subtitles', 'texts', 'ayahs', 'texts', 'ayahs'],
    },
    // Page 13
    {
      ayahs: [ElmTextTwentyOne.ayahHadithTwentyOneThirteen_1],
      texts: [ElmTextTwentyOne.elmTextTwentyOneThirteen_1],
      ayahs: [ElmTextTwentyOne.ayahHadithTwentyOneThirteen_2],
      order: ['ayahs', 'texts', 'ayahs'],
    },
    // Page 14
    {
      subtitles: [ElmTextTwentyOne.subtitleTwentyOneFourteen_1],
      texts: [
        ElmTextTwentyOne.elmTextTwentyOneFourteen_1,
        ElmTextTwentyOne.elmTextTwentyOneFourteen_2,
      ],
      ayahs: [
        ElmTextTwentyOne.ayahHadithTwentyOneFourteen_1,
        ElmTextTwentyOne.ayahHadithTwentyOneFourteen_2,
      ],
      order: ['subtitles', 'texts', 'ayahs', 'texts', 'ayahs'],
    },
    // Page 15
    {
      texts: [ElmTextTwentyOne.elmTextTwentyOneFifteen_1],
      subtitles: [ElmTextTwentyOne.subtitleTwentyOneFifteen_1],
      texts: [
        ElmTextTwentyOne.elmTextTwentyOneFifteen_2,
        ElmTextTwentyOne.elmTextTwentyOneFifteen_3,
      ],
      ayahs: [ElmTextTwentyOne.ayahHadithTwentyOneFifteen_1],
      order: ['texts', 'subtitles', 'texts', 'ayahs', 'texts'],
    },
    // Page 16
    {
      ayahs: [ElmTextTwentyOne.ayahHadithTwentyOneSixteen_1],
      texts: [
        ElmTextTwentyOne.elmTextTwentyOneSixteen_1,
        ElmTextTwentyOne.elmTextTwentyOneSixteen_2,
      ],
      ayahs: [ElmTextTwentyOne.ayahHadithTwentyOneSixteen_2],
      order: ['ayahs', 'texts', 'ayahs', 'texts', 'ayahs'],
    },
    // Page 17
    {
      texts: [ElmTextTwentyOne.elmTextTwentyOneSeventeen_1],
      ayahs: [ElmTextTwentyOne.ayahHadithTwentyOneSeventeen_1],
      subtitles: [ElmTextTwentyOne.subtitleTwentyOnSeventeen_1],
      texts: [
        ElmTextTwentyOne.elmTextTwentyOneSeventeen_2,
        ElmTextTwentyOne.elmTextTwentyOneSeventeen_3,
      ],
      order: ['texts', 'ayahs', 'subtitles', 'texts', 'texts'],
    },
    // Page 18
    {
      texts: [ElmTextTwentyOne.elmTextTwentyOneEighteen_1],
      ayahs: [
        ElmTextTwentyOne.ayahHadithTwentyOneEighteen_1,
        ElmTextTwentyOne.ayahHadithTwentyOneEighteen_2,
      ],
      texts: [ElmTextTwentyOne.elmTextTwentyOneEighteen_2],
      ayahs: [
        ElmTextTwentyOne.ayahHadithTwentyOneEighteen_2,
        ElmTextTwentyOne.ayahHadithTwentyOneEighteen_3,
      ],
      order: ['texts', 'ayahs', 'texts', 'ayahs', 'texts', 'ayahs'],
    },
    // Page 19
    {
      texts: [ElmTextTwentyOne.elmTextTwentyOneNineteen_1],
      ayahs: [ElmTextTwentyOne.ayahHadithTwentyOneNineteen_1],
      subtitles: [ElmTextTwentyOne.subtitleTwentyOneNineteen_1],
      texts: [
        ElmTextTwentyOne.elmTextTwentyOneNineteen_2,
        ElmTextTwentyOne.elmTextTwentyOneNineteen_3,
      ],
      ayahs: [ElmTextTwentyOne.ayahHadithTwentyOneNineteen_2],
      order: ['texts', 'ayahs', 'subtitles', 'texts', 'texts', 'ayahs'],
    },
    // Page 20
    {
      texts: [
        ElmTextTwentyOne.elmTextTwentyOneTwenty_1,
        ElmTextTwentyOne.elmTextTwentyOneTwenty_2,
        ElmTextTwentyOne.elmTextTwentyOneTwenty_3,
        ElmTextTwentyOne.elmTextTwentyOneTwenty_4,
      ],
      ayahs: [
        ElmTextTwentyOne.ayahHadithTwentyOneTwenty_1,
        ElmTextTwentyOne.ayahHadithTwentyOneTwenty_2,
        ElmTextTwentyOne.ayahHadithTwentyOneTwenty_3,
        ElmTextTwentyOne.ayahHadithTwentyOneTwenty_4,
      ],
      order: ['texts', 'ayahs', 'texts', 'ayahs', 'texts', 'ayahs', 'texts', 'ayahs'],
    },
    // Page 21
    {
      subtitles: [ElmTextTwentyOne.subtitleTwentyOneTwentyOne_1],
      texts: [
        ElmTextTwentyOne.elmTextTwentyOneTwentyOne_1,
        ElmTextTwentyOne.elmTextTwentyOneTwentyOne_2,
        ElmTextTwentyOne.elmTextTwentyOneTwentyOne_3,
      ],
      ayahs: [
        ElmTextTwentyOne.ayahHadithTwentyOneTwentyOne_1,
        ElmTextTwentyOne.ayahHadithTwentyOneTwentyOne_2,
      ],
      order: ['subtitles', 'texts', 'ayahs', 'texts', 'ayahs', 'texts', 'ayahs'],
    },
    // Page 22
    {
      texts: [
        ElmTextTwentyOne.elmTextTwentyOneTwentyTwo_1,
        ElmTextTwentyOne.elmTextTwentyOneTwentyTwo_2,
        ElmTextTwentyOne.elmTextTwentyOneTwentyTwo_3,
      ],
      ayahs: [
        ElmTextTwentyOne.ayahHadithTwentyOneTwentyTwo_1,
        ElmTextTwentyOne.ayahHadithTwentyOneTwentyTwo_2,
      ],
      order: ['texts', 'ayahs', 'texts', 'ayahs', 'texts'],
    },
    // Page 23 - وقفة
    {
      titles: [ElmTextTwentyOne.titleTwentyOneTwentyThree],
      subtitles: [ElmTextTwentyOne.subtitleTwentyOneTwentyThree_1],
      ayahs: [
        ElmTextTwentyOne.ayahHadithTwentyOneTwentyThree_1,
        ElmTextTwentyOne.ayahHadithTwentyOneTwentyThree_2,
      ],
      texts: [
        ElmTextTwentyOne.elmTextTwentyOneTwentyThree_1,
        ElmTextTwentyOne.elmTextTwentyOneTwentyThree_2,
      ],
      order: ['titles', 'subtitles', 'ayahs', 'texts', 'ayahs', 'texts'],
    },
    // Page 24 - وقفة 2
    {
      ayahs: [ElmTextTwentyOne.ayahHadithTwentyOneTwentyFour_1],
      texts: [ElmTextTwentyOne.elmTextTwentyOneTwentyFour_1],
      order: ['ayahs', 'texts'],
    },
    // Page 25 - وقفة 3
    {
      ayahs: [ElmTextTwentyOne.ayahHadithTwentyOneTwentyFive_1],
      texts: [ElmTextTwentyOne.elmTextTwentyOneTwentyFive_1],
      order: ['ayahs', 'texts'],
    },
    // Page 26 - وقفة 4
    {
      ayahs: [ElmTextTwentyOne.ayahHadithTwentyOneTwentySix_1],
      subtitles: [ElmTextTwentyOne.subtitleTwentyOneTwentySix_1],
      texts: [ElmTextTwentyOne.elmTextTwentyOneTwentySix_1],
      ayahs: [ElmTextTwentyOne.ayahHadithTwentyOneTwentySix_2],
      order: ['ayahs', 'subtitles', 'texts', 'ayahs'],
    },
  ];

  // Generate detailedOrder for each item
  const itemsWithDetailedOrder = chapter21Items.map((item) => {
    const detailedOrder = item.order.map((type) => ({
      type,
      index: 0,
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
  data.lists['21'] = itemsWithDetailedOrder;

  // Write back to file
  fs.writeFileSync(
    dataPath,
    JSON.stringify(data, null, 2),
    'utf8'
  );

  console.log('✅ Chapter 21 updated successfully!');
  console.log(`   - ${itemsWithDetailedOrder.length} items added`);
  console.log(`   - Total content blocks: ${itemsWithDetailedOrder.reduce((acc, item) => acc + item.order.length, 0)}`);
}

updateChapter21();
