'use client';

import { useState } from 'react';

export default function Home() {
  const [step, setStep] = useState('welcome');

  //#region 基本資料
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [region, setRegion] = useState('');
  const [education, setEducation] = useState('');
  const [profileError, setProfileError] = useState('');
  // #endregion

  //#region 填答資格
  const [rpgSteamUse, setRpgSteamUse] = useState('');
  const [reviewUse, setReviewUse] = useState('');
  const [featureKnow, setFeatureKnow] = useState('');
  const [eligibilityError, setEligibilityError] = useState('');
  const isEligibilityRejected =
    rpgSteamUse === '否' || reviewUse === '否' || featureKnow === '否';
  // #endregion

  //#region AHP 練習
  const [practiceBC, setPracticeBC] = useState(9);
  // #endregion

  // AHP常數宣告--滑桿、是否動過
  const [answers, setAnswers] = useState({
    lv1: {
      AB: { value: 9, touched: false },
      AC: { value: 9, touched: false },
      BC: { value: 9, touched: false },
    },
    lv2_1: {
      AB: { value: 9, touched: false },
      AC: { value: 9, touched: false },
      BC: { value: 9, touched: false },
    },
    lv2_2: {
      AB: { value: 9, touched: false },
      AC: { value: 9, touched: false },
      BC: { value: 9, touched: false },
    },
    lv2_3: {
      AB: { value: 9, touched: false },
      AC: { value: 9, touched: false },
      BC: { value: 9, touched: false },
    },
  });

  // AHP常數宣告--錯誤訊息
  const [errors, setErrors] = useState({
    lv1: '',
    lv2_1: '',
    lv2_2: '',
    lv2_3: '',
  });

  // AHP頁面中，三個比較都被動過
  const isGroupCompleted = (groupKey) => {
    return Object.values(answers[groupKey]).every((item) => item.touched);
  };

  // AHP頁面中，更新答案並清除該組錯誤訊息
  const updateAnswer = (groupKey, pairKey, value) => {
    setAnswers((prev) => ({
      ...prev,
      [groupKey]: {
        ...prev[groupKey],
        [pairKey]: {
          value: value,
          touched: true,
        },
      },
    }));

    setErrors((prev) => ({
      ...prev,
      [groupKey]: '',
    }));
  };

  //AHP常數宣告--滑桿位置與比例對應表
  const sliderRatioMap = {
    1: '9:1',
    2: '8:1',
    3: '7:1',
    4: '6:1',
    5: '5:1',
    6: '4:1',
    7: '3:1',
    8: '2:1',
    9: '1:1',
    10: '1:2',
    11: '1:3',
    12: '1:4',
    13: '1:5',
    14: '1:6',
    15: '1:7',
    16: '1:8',
    17: '1:9',
  };

  // AHP常數宣告--每組比較的三個順序
  const pairs = [
    ['AB', 'A', 'B'],
    ['AC', 'A', 'C'],
    ['BC', 'B', 'C'],
  ];

  const progressSteps = [
    'profile',
    'eligibility',
    'tutorial',
    'formalIntro',
    'lv1Intro',
    'lv1Done',
    'lv2_1Intro',
    'lv2_1Done',
    'lv2_2Intro',
    'lv2_2Done',
    'lv2_3Intro',
    'lv2_3Done',
    'finished',
  ];

  const renderProgressBar = () => {
    const currentIndex = progressSteps.indexOf(step);

    if (currentIndex === -1) {
      return null;
    }

    const currentStep = currentIndex + 1;
    const totalSteps = progressSteps.length;
    const progressPercent = (currentStep / totalSteps) * 100;

    return (
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-500">
          <span>填答進度</span>
          <span>
            {currentStep} / {totalSteps}
          </span>
        </div>

        <div className="h-2 w-full rounded-full bg-slate-200">
          <div
            className="h-2 rounded-full bg-slate-900 transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    );
  };

  // AHP頁面內容宣告
  const ahpPages = {
    lv1: {
      title: '第 1 組：主要構面比較（Lv1）',
      intro: '接下來，請比較三個主要構面在評估「Steam 上 RPG 推薦評論有效性」時的相對重要程度。',
      backStep: 'formalIntro',
      nextStep: 'lv1Done',
      items: {
        A: {
          name: '評論者屬性構面',
          description: '包含：該遊戲遊玩時數、帳號總擁有遊戲數量、帳號累積評論數',
        },
        B: {
          name: '評論內容構面',
          description: '包含：評論長度、熵值（用詞多樣性）、評論雙向性',
        },
        C: {
          name: '使用者互動構面',
          description: '包含：有幫助票數、有趣票數、回覆（留言）長度',
        },
      },
    },

    lv2_1: {
      title: '第 2 組：評論者屬性構面比較',
      intro: '接下來，請比較「評論者屬性構面」中的三個子因素，判斷它們在評估 Steam 上 RPG 推薦評論有效性時的相對重要程度。',
      backStep: 'lv1Done',
      nextStep: 'lv2_1Done',
      items: {
        A: {
          name: '該遊戲遊玩時數',
          description: '指評論者在該遊戲上的累積遊玩時數。',
        },
        B: {
          name: '帳號總擁有遊戲數量',
          description: '指評論者 Steam 帳號中擁有的遊戲總數。',
        },
        C: {
          name: '帳號累積評論數',
          description: '指評論者在 Steam 上累積發表的評論總數。',
        },
      },
    },

    lv2_2: {
      title: '第 3 組：評論內容構面比較',
      intro: '接下來，請比較「評論內容構面」中的三個子因素，判斷它們在評估 Steam 上 RPG 推薦評論有效性時的相對重要程度。',
      backStep: 'lv2_1Done',
      nextStep: 'lv2_2Done',
      items: {
        A: {
          name: '評論長度',
          description: '指評論文字內容的篇幅長短。',
        },
        B: {
          name: '熵值（用詞多樣性）',
          description: '指評論內容中用詞與資訊表達的多樣程度。',
        },
        C: {
          name: '評論雙向性',
          description: '指評論是否同時呈現遊戲的正面與負面觀點。',
        },
      },
    },

    lv2_3: {
      title: '第 4 組：使用者互動構面比較',
      intro: '接下來，請比較「使用者互動構面」中的三個子因素，判斷它們在評估 Steam 上 RPG 推薦評論有效性時的相對重要程度。',
      backStep: 'lv2_2Done',
      nextStep: 'lv2_3Done',
      items: {
        A: {
          name: '有幫助票數',
          description: '指其他使用者認為該評論有幫助的票數。',
        },
        B: {
          name: '有趣票數',
          description: '指其他使用者認為該評論有趣的票數。',
        },
        C: {
          name: '回覆（留言）長度',
          description: '指該評論下方使用者回覆或留言內容的篇幅長短。',
        },
      },
    }
  };

  // AHP頁面內容渲染函式
  const renderAhpPage = (groupKey, backButtonText = '回到上一頁') => {
    const group = ahpPages[groupKey];

    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-3xl px-6 py-12">
          <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            {renderProgressBar()}
            <h2 className="text-2xl font-bold tracking-tight">
              {group.title}
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-7 text-slate-700">
              <p>{group.intro}</p>

              {Object.entries(group.items).map(([key, item]) => (
                <div key={key} className="rounded-xl border border-slate-200 px-4 py-4">
                  <p className="font-medium text-slate-900">
                    {key}. {item.name}
                  </p>
                  <p className="mt-2 text-slate-700">
                    {item.description}
                  </p>
                </div>
              ))}

              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4">
                <p className="font-medium text-amber-900">作答提醒：</p>
                <p className="mt-2 text-amber-800">
                  接下來您將依序完成三組兩兩比較。請依照滑桿的左右方向與比例意義，判斷各構面之間的相對重要程度。
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-6">
              {pairs.map(([pairKey, leftKey, rightKey]) => {
                const left = group.items[leftKey];
                const right = group.items[rightKey];
                const currentValue = answers[groupKey][pairKey].value;

                return (
                  <div key={pairKey} className="rounded-xl border border-slate-200 p-4">
                    <p className="text-sm font-medium text-slate-900">
                      {leftKey}【{left.name}】 vs {rightKey}【{right.name}】
                    </p>

                    <div className="mt-4 grid grid-cols-3 items-center gap-3 text-sm text-slate-700">
                      <div className="font-medium">{leftKey} {left.name}</div>
                      <div className="text-center text-slate-500">中間 = 一樣重要</div>
                      <div className="text-right font-medium">{rightKey} {right.name}</div>
                    </div>

                    <input
                      type="range"
                      min="1"
                      max="17"
                      step="1"
                      value={currentValue}
                      onChange={(e) => {
                        updateAnswer(groupKey, pairKey, Number(e.target.value));
                      }}
                      className="mt-4 w-full"
                    />

                    <div className="mt-3 rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
                      <p>滑桿位置：{currentValue}</p>
                      <p>對應比例：{sliderRatioMap[currentValue]}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {errors[groupKey] && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm leading-7 text-red-700">
                {errors[groupKey]}
              </div>
            )}

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setStep(group.backStep)}
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                {backButtonText}
              </button>

              <button
                onClick={() => {
                  if (!isGroupCompleted(groupKey)) {
                    setErrors((prev) => ({
                      ...prev,
                      [groupKey]: '請先完成三組比較後，再進入下一步。',
                    }));
                    return;
                  }

                  setStep(group.nextStep);
                }}
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                下一步
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  };

  // AHP完成頁面內容
  const donePages = {
    lv1Done: {
      groupKey: 'lv1',
      title: '第 1 組已完成',
      description: '您已完成第 1 組主要構面的兩兩比較。',
      backStep: 'lv1Intro',
      nextStep: 'lv2_1Intro',
      nextText: '確認並進入下一頁',
    },
    lv2_1Done: {
      groupKey: 'lv2_1',
      title: '第 2 組已完成',
      description: '您已完成第 2 組評論者屬性構面中的子因素比較。',
      backStep: 'lv2_1Intro',
      nextStep: 'lv2_2Intro',
      nextText: '確認並進入下一頁',
    },
    lv2_2Done: {
      groupKey: 'lv2_2',
      title: '第 3 組已完成',
      description: '您已完成第 3 組評論內容構面中的子因素比較。',
      backStep: 'lv2_2Intro',
      nextStep: 'lv2_3Intro',
      nextText: '確認並進入下一頁',
    },
    lv2_3Done: {
      groupKey: 'lv2_3',
      title: '第 4 組已完成',
      description: '您已完成第 4 組使用者互動構面中的子因素比較。',
      backStep: 'lv2_3Intro',
      nextStep: 'finished',
      nextText: '完成問卷',
    },
  };

  //AHP完成頁面內容渲染函式
  const renderDonePage = (doneKey) => {
    const page = donePages[doneKey];
    const groupKey = page.groupKey;
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-3xl px-6 py-12">
          <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            {renderProgressBar()}
            <h2 className="text-2xl font-bold tracking-tight">
              {page.title}
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-7 text-slate-700">
              <p>{page.description}</p>

              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4">
                <p className="font-medium text-amber-900">作答提醒：</p>
                <p className="mt-2 text-amber-800">
                  到下一頁前，請您回頭想想剛才三組比較結果是否合理，
                  並確認整體判斷是否符合您的真實想法。
                </p>
              </div>

              <div className="rounded-xl bg-slate-100 px-4 py-4">
                <p>
                  A vs B：滑桿位置 {answers[groupKey].AB.value}，
                  比例 {sliderRatioMap[answers[groupKey].AB.value]}
                </p>
                <p>
                  A vs C：滑桿位置 {answers[groupKey].AC.value}，
                  比例 {sliderRatioMap[answers[groupKey].AC.value]}
                </p>
                <p>
                  B vs C：滑桿位置 {answers[groupKey].BC.value}，
                  比例 {sliderRatioMap[answers[groupKey].BC.value]}
                </p>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setStep(page.backStep)}
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                回到上一頁檢查
              </button>

              <button
                onClick={() => setStep(page.nextStep)}
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                {page.nextText}
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  };

  //問卷重置函式
  const resetQuestionnaire = () => {
    setStep('welcome');

    setGender('');
    setAge('');
    setRegion('');
    setEducation('');
    setProfileError('');

    setRpgSteamUse('');
    setReviewUse('');
    setFeatureKnow('');
    setEligibilityError('');

    setPracticeBC(9);

    setAnswers({
      lv1: {
        AB: { value: 9, touched: false },
        AC: { value: 9, touched: false },
        BC: { value: 9, touched: false },
      },
      lv2_1: {
        AB: { value: 9, touched: false },
        AC: { value: 9, touched: false },
        BC: { value: 9, touched: false },
      },
      lv2_2: {
        AB: { value: 9, touched: false },
        AC: { value: 9, touched: false },
        BC: { value: 9, touched: false },
      },
      lv2_3: {
        AB: { value: 9, touched: false },
        AC: { value: 9, touched: false },
        BC: { value: 9, touched: false },
      },
    });

    setErrors({
      lv1: '',
      lv2_1: '',
      lv2_2: '',
      lv2_3: '',
    });
  };


  if (step === 'welcome') {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-3xl px-6 py-12">
          <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h1 className="text-3xl font-bold tracking-tight">
              Steam RPG 推薦評論有效性評估問卷
            </h1>

            <p className="mt-4 text-base leading-7 text-slate-700">
              您好，感謝您撥空填寫本問卷。本研究主要希望了解玩家在閱讀
              Steam 平台 RPG 遊戲推薦評論時，哪些因素會影響其對評論有效性的判斷。
            </p>

            <div className="mt-6 space-y-3 text-sm leading-7 text-slate-700">
              <p>
                <span className="font-semibold text-slate-900">填答資格：</span>
                年滿 18 歲，且具 Steam 使用經驗者。
              </p>
              <p>
                <span className="font-semibold text-slate-900">填答時間：</span>
                約 10–15 分鐘。
              </p>
              <p>
                <span className="font-semibold text-slate-900">資料使用說明：</span>
                本問卷採匿名方式蒐集，僅供學術研究與統計分析使用。
              </p>
            </div>

            <button
              onClick={() => setStep('profile')}
              className="mt-8 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              開始填答
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (step === 'profile') {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-3xl px-6 py-12">
          <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            {renderProgressBar()}
            <h2 className="text-2xl font-bold tracking-tight">基本資料頁</h2>

            <p className="mt-4 text-base leading-7 text-slate-700">
              請先填寫基本資料。
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-3 block text-sm font-medium text-slate-900">
                  生理性別
                </label>

                <div className="space-y-2 text-sm text-slate-700">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gender"
                      value="生理男"
                      checked={gender === '生理男'}
                      onChange={(e) => {
                        setGender(e.target.value);
                        setProfileError('');
                      }}
                    />
                    生理男
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gender"
                      value="生理女"
                      checked={gender === '生理女'}
                      onChange={(e) => {
                        setGender(e.target.value);
                        setProfileError('');
                      }}
                    />
                    生理女
                  </label>
                </div>
              </div>

              <div>
                <label className="mb-3 block text-sm font-medium text-slate-900">
                  年齡
                </label>

                <div className="space-y-2 text-sm text-slate-700">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="age"
                      value="18–24 歲"
                      checked={age === '18–24 歲'}
                      onChange={(e) => {
                        setAge(e.target.value);
                        setProfileError('');
                      }}
                    />
                    18–24 歲
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="age"
                      value="25–34 歲"
                      checked={age === '25–34 歲'}
                      onChange={(e) => {
                        setAge(e.target.value);
                        setProfileError('');
                      }}
                    />
                    25–34 歲
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="age"
                      value="35–44 歲"
                      checked={age === '35–44 歲'}
                      onChange={(e) => {
                        setAge(e.target.value);
                        setProfileError('');
                      }}
                    />
                    35–44 歲
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="age"
                      value="45 歲以上"
                      checked={age === '45 歲以上'}
                      onChange={(e) => {
                        setAge(e.target.value);
                        setProfileError('');
                      }}
                    />
                    45 歲以上
                  </label>
                </div>
              </div>

              <div>
                <label className="mb-3 block text-sm font-medium text-slate-900">
                  所在地區
                </label>

                <div className="space-y-2 text-sm text-slate-700">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="region"
                      value="台灣"
                      checked={region === '台灣'}
                      onChange={(e) => {
                        setRegion(e.target.value);
                        setProfileError('');
                      }}
                    />
                    台灣
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="region"
                      value="香港"
                      checked={region === '香港'}
                      onChange={(e) => {
                        setRegion(e.target.value);
                        setProfileError('');
                      }}
                    />
                    香港
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="region"
                      value="澳門"
                      checked={region === '澳門'}
                      onChange={(e) => {
                        setRegion(e.target.value);
                        setProfileError('');
                      }}
                    />
                    澳門
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="region"
                      value="其他海外地區"
                      checked={region === '其他海外地區'}
                      onChange={(e) => {
                        setRegion(e.target.value);
                        setProfileError('');
                      }}
                    />
                    其他海外地區
                  </label>
                </div>
              </div>

              <div>
                <label className="mb-3 block text-sm font-medium text-slate-900">
                  最高學歷
                </label>

                <div className="space-y-2 text-sm text-slate-700">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="education"
                      value="國中以下"
                      checked={education === '國中以下'}
                      onChange={(e) => {
                        setEducation(e.target.value);
                        setProfileError('');
                      }}
                    />
                    國中以下
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="education"
                      value="高中職"
                      checked={education === '高中職'}
                      onChange={(e) => {
                        setEducation(e.target.value);
                        setProfileError('');
                      }}
                    />
                    高中職
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="education"
                      value="大專／大學"
                      checked={education === '大專／大學'}
                      onChange={(e) => {
                        setEducation(e.target.value);
                        setProfileError('');
                      }}
                    />
                    大專／大學
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="education"
                      value="研究所以上"
                      checked={education === '研究所以上'}
                      onChange={(e) => {
                        setEducation(e.target.value);
                        setProfileError('');
                      }}
                    />
                    研究所以上
                  </label>
                </div>
              </div>

              {profileError && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm leading-7 text-red-700">
                  {profileError}
                </div>
              )}

            </div>


            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setStep('welcome')}
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                回到首頁
              </button>

              <button
                onClick={() => {
                  if (!gender || !age || !region || !education) {
                    setProfileError('請先完成所有基本資料後，再進入下一步。');
                    return;
                  }

                  setProfileError('');
                  setStep('eligibility');
                }}
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                下一步
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (step === 'eligibility') {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-3xl px-6 py-12">
          <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            {renderProgressBar()}
            <h2 className="text-2xl font-bold tracking-tight">填答條件確認</h2>

            <p className="mt-4 text-base leading-7 text-slate-700">
              請先確認您符合本研究的填答條件。
            </p>

            <div className="mt-6 space-y-4">
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-sm font-medium text-slate-900">
                  1. 過去一年內，您是否曾接觸 RPG 類型遊戲，且曾使用 Steam 平台瀏覽或購買遊戲？
                </p>

                <div className="mt-3 space-y-2 text-sm text-slate-700">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="rpgSteam"
                      value="是"
                      checked={rpgSteamUse === '是'}
                      onChange={(e) => {
                        setRpgSteamUse(e.target.value);
                        setEligibilityError('');
                      }}
                    />
                    是
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="rpgSteam"
                      value="否"
                      checked={rpgSteamUse === '否'}
                      onChange={(e) => {
                        setRpgSteamUse(e.target.value);
                        setEligibilityError('');
                      }}
                    />
                    否
                  </label>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-sm font-medium text-slate-900">
                  2. 您是否曾閱讀 Steam 上的遊戲評論，並將其作為是否購買遊戲的參考？
                </p>

                <div className="mt-3 space-y-2 text-sm text-slate-700">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="reviewUse"
                      value="是"
                      checked={reviewUse === '是'}
                      onChange={(e) => {
                        setReviewUse(e.target.value);
                        setEligibilityError('');
                      }}
                    />
                    是
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="reviewUse"
                      value="否"
                      checked={reviewUse === '否'}
                      onChange={(e) => {
                        setReviewUse(e.target.value);
                        setEligibilityError('');
                      }}
                    />
                    否
                  </label>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-sm font-medium text-slate-900">
                  3. 您是否了解 Steam 評論區的常見功能，例如「推薦／不推薦」、「有幫助」或「有趣」等互動機制？
                </p>

                <div className="mt-3 space-y-2 text-sm text-slate-700">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="featureKnow"
                      value="是"
                      checked={featureKnow === '是'}
                      onChange={(e) => {
                        setFeatureKnow(e.target.value);
                        setEligibilityError('');
                      }}
                    />
                    是
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="featureKnow"
                      value="否"
                      checked={featureKnow === '否'}
                      onChange={(e) => {
                        setFeatureKnow(e.target.value);
                        setEligibilityError('');
                      }}
                    />
                    否
                  </label>
                </div>
              </div>

              {isEligibilityRejected && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm leading-7 text-red-700">
                  由於本研究對填答對象設有特定條件，您目前不在本次研究的適用範圍內。
                </div>
              )}

              {eligibilityError && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm leading-7 text-red-700">
                  {eligibilityError}
                </div>
              )}

            </div>



            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setStep('profile')}
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                回到基本資料頁
              </button>

              <button
                onClick={() => {
                  if (!rpgSteamUse || !reviewUse || !featureKnow) {
                    setEligibilityError('請先完成三題填答條件確認後，再進入下一步。');
                    return;
                  }

                  setEligibilityError('');

                  if (isEligibilityRejected) {
                    setStep('rejected');
                  } else {
                    setStep('tutorial');
                  }
                }}
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                下一步
              </button>

            </div>
          </div>
        </div>
      </main>
    );
  }

  if (step === 'rejected') {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-3xl px-6 py-12">
          <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-2xl font-bold tracking-tight">感謝您的填答</h2>

            <p className="mt-4 text-base leading-7 text-slate-700">
              由於本研究對填答對象設有特定條件，您目前不在本次研究的適用範圍內，因此問卷到此結束。
            </p>

            <p className="mt-4 text-base leading-7 text-slate-700">
              仍誠摯感謝您的參與與協助。
            </p>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setStep('welcome')}
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                回到首頁
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (step === 'tutorial') {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-3xl px-6 py-12">
          <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            {renderProgressBar()}
            <h2 className="text-2xl font-bold tracking-tight">作答說明與練習</h2>

            <div className="mt-6 space-y-6 text-sm leading-7 text-slate-700">
              <div className="space-y-3">
                <p>我們先來一起練習一下。</p>
                <p>接下來將進入 AHP 兩兩比較題。</p>
                <p>
                  在後面的題目中，您會看到兩個因素，請依您的實際經驗判斷：
                  <span className="font-semibold text-slate-900">
                    哪一個因素對於判斷 Steam 上 RPG 推薦評論是否有效更重要。
                  </span>
                </p>
              </div>

              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4">
                <p className="font-medium text-amber-900">
                  請特別注意：本問卷並非一般 5 點量表。
                </p>
                <p className="mt-2 text-amber-800">
                  本問卷中的滑桿不只代表您認為哪一個因素較重要，也代表兩者之間的重要程度差距有多大。
                  因此，作答時請不要只判斷左邊或右邊較重要，也請同時考慮兩者之間的重要倍數差距。
                </p>
              </div>

              <div className="rounded-xl bg-slate-100 px-4 py-4">
                <p className="font-medium text-slate-900">作答方式如下：</p>
                <div className="mt-3 space-y-1">
                  <p>• 滑桿向左邊（1–8）代表前者較重要</p>
                  <p>• 滑桿位於中間（9）代表兩者一樣重要</p>
                  <p>• 滑桿向右邊（10–17）代表後者較重要</p>
                  <p>• 選得越靠近兩側，代表您認為兩者的重要差距越大</p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 px-4 py-4">
                <p className="font-medium text-slate-900">
                  本問卷中，滑桿 1–17 分別對應兩側內容的重要程度比例：
                </p>
                <p className="mt-3 break-words text-slate-700">
                  9:1、8:1、7:1、6:1、5:1、4:1、3:1、2:1、1:1、1:2、1:3、1:4、1:5、1:6、1:7、1:8、1:9
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 px-4 py-4">
                <p className="font-medium text-slate-900">例如：</p>
                <div className="mt-3 space-y-2">
                  <p>
                    若滑桿位於 <span className="font-semibold">15</span>，表示您認為
                    <span className="font-semibold">右側因素</span>
                    相較於
                    <span className="font-semibold">左側因素</span>
                    更重要。
                  </p>
                  <p>
                    在本問卷的換算中，滑桿 <span className="font-semibold">3</span> 對應的比例為
                    <span className="font-semibold"> 7:1 </span>
                    ，表示左側因素相較於右側因素極為重要。
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4">
                <p className="font-medium text-emerald-900">正式作答前提醒：</p>
                <p className="mt-2 text-emerald-800">
                  本問卷中的滑桿位置具有比例意義，請不要只判斷左右方向，也請同時考慮兩者之間的重要倍數差距。
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-4 text-sm leading-7 text-slate-700">
              <p>
                以下練習題僅用於確認您是否理解作答方式，不會影響正式作答結果。
              </p>

              <p>
                假設您正在判斷一部電影是否「精彩」，並以下列三項因素作為評估依據：
              </p>

              <div className="rounded-xl bg-slate-100 px-4 py-4">
                <p>A. 劇情有深度</p>
                <p>B. 畫面表現出眾</p>
                <p>C. 音樂動聽</p>
              </div>

              <p>
                接下來，您將看到其中兩組比較結果已先提供。
                請您依據這些比較關係，判斷最後一組因素之間何者較重要，並將滑桿調整至您認為較合理的位置。
              </p>
            </div>

            <div className="mt-8 space-y-4">
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-sm font-medium text-slate-900">
                  已知比較 1：A 劇情有深度 vs B 畫面表現出眾
                </p>
                <p className="mt-2 text-sm text-slate-700">
                  A 比 B 稍微重要
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-sm font-medium text-slate-900">
                  已知比較 2：A 劇情有深度 vs C 音樂動聽
                </p>
                <p className="mt-2 text-sm text-slate-700">
                  A 比 C 極為重要
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-sm font-medium text-slate-900">
                  請完成比較 3：B 畫面表現出眾 vs C 音樂動聽
                </p>

                <div className="mt-4 grid grid-cols-3 items-center gap-3 text-sm text-slate-700">
                  <div className="font-medium">B 畫面表現出眾</div>
                  <div className="text-center text-slate-500">中間 = 一樣重要</div>
                  <div className="text-right font-medium">C 音樂動聽</div>
                </div>

                <input
                  type="range"
                  min="1"
                  max="17"
                  step="1"
                  value={practiceBC}
                  onChange={(e) => setPracticeBC(Number(e.target.value))}
                  className="mt-4 w-full"
                />

                <div className="mt-3 rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
                  <p>目前滑桿位置：{practiceBC}</p>
                  <p>對應比例：{sliderRatioMap[practiceBC]}</p>
                  <p className="mt-1 text-slate-500">
                    {practiceBC < 9 && '目前表示左側因素較重要'}
                    {practiceBC === 9 && '目前表示兩者一樣重要'}
                    {practiceBC > 9 && '目前表示右側因素較重要'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setStep('eligibility')}
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                回到篩選頁
              </button>

              <button
                onClick={() => {
                  if (practiceBC < 9) {
                    setStep('formalIntro');
                  } else {
                    setStep('logicHelp');
                  }
                }}
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                下一步
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (step === 'logicHelp') {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-3xl px-6 py-12">
          <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-2xl font-bold tracking-tight">邏輯補充說明</h2>

            <p className="mt-4 text-base leading-7 text-slate-700">
              在這個例子中，前兩組比較結果已顯示：
            </p>

            <div className="mt-6 space-y-3 rounded-xl bg-slate-100 px-4 py-4 text-sm leading-7 text-slate-700">
              <p>A 比 B 稍微重要</p>
              <p>A 比 C 極為重要</p>
            </div>

            <div className="mt-6 space-y-4 text-sm leading-7 text-slate-700">
              <p>
                若 A 比 B 重要一些，而 A 又比 C 重要更多，通常表示 B 的重要性會介於 A 與 C 之間。
              </p>
              <p>
                因此，在 B 與 C 的比較中，較合理的判斷方向通常會是：
                <span className="font-semibold text-slate-900"> B 比 C 重要</span>
              </p>
              <p>
                也就是說，三者的整體關係通常較接近：
                <span className="font-semibold text-slate-900"> A &gt; B &gt; C</span>
              </p>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setStep('tutorial')}
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                回到練習題
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (step === 'formalIntro') {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-3xl px-6 py-12">
          <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            {renderProgressBar()}
            <h2 className="text-2xl font-bold tracking-tight">正式作答開始</h2>

            <div className="mt-4 space-y-4 text-sm leading-7 text-slate-700">
              <p>
                接下來將進入正式問卷作答。
              </p>

              <p>
                正式題目將以 AHP 兩兩比較方式呈現，請您依據自身經驗，判斷各因素在評估
                Steam 上 RPG 推薦評論有效性時的相對重要程度。
              </p>

              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4">
                <p className="font-medium text-amber-900">作答前提醒：</p>
                <p className="mt-2 text-amber-800">
                  請不要只判斷左右哪一邊較重要，也請同時考慮兩者之間的重要倍數差距。
                </p>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setStep('tutorial')}
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                回到練習題
              </button>

              <button
                onClick={() => setStep('lv1Intro')}
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                進入正式題
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (step === 'lv1Intro') {
    return renderAhpPage('lv1', '回到正式作答開始');
  }

  if (step === 'lv1Done') {
    return renderDonePage('lv1Done');
  }

  if (step === 'lv2_1Intro') {
    return renderAhpPage('lv2_1');
  }

  if (step === 'lv2_1Done') {
    return renderDonePage('lv2_1Done');
  }

  if (step === 'lv2_2Intro') {
    return renderAhpPage('lv2_2');
  }

  if (step === 'lv2_2Done') {
    return renderDonePage('lv2_2Done');
  }

  if (step === 'lv2_3Intro') {
    return renderAhpPage('lv2_3');
  }

  if (step === 'lv2_3Done') {
    return renderDonePage('lv2_3Done');
  }

  if (step === 'finished') {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-3xl px-6 py-12">
          <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-2xl font-bold tracking-tight">問卷已完成</h2>

            <p className="mt-4 text-base leading-7 text-slate-700">
              感謝您的填答。您已完成本問卷所有 AHP 兩兩比較題。
            </p>

            <div className="mt-8 flex gap-3">
              <button
                onClick={resetQuestionnaire}
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                回到首頁
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-2xl font-bold tracking-tight">頁面狀態錯誤</h2>
          <p className="mt-4 text-sm leading-7 text-slate-700">
            目前 step 沒有對應到任何頁面，請檢查 setStep 的名稱是否拼寫正確。
          </p>
        </div>
      </div>
    </main>
  );

}