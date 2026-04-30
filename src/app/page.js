'use client';

import { useState } from 'react';

export default function Home() {
  const [step, setStep] = useState('welcome');

  //#region 基本資料
  //一般資料宣告
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [region, setRegion] = useState('');
  const [education, setEducation] = useState('');
  const [profileError, setProfileError] = useState('');
  //頁尾聯絡資訊宣告
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  // #endregion

  //#region 填答資格
  const [rpgSteamUse, setRpgSteamUse] = useState('');
  const [reviewUse, setReviewUse] = useState('');
  const [featureKnow, setFeatureKnow] = useState('');
  const [eligibilityError, setEligibilityError] = useState('');
  const isEligibilityRejected =
    rpgSteamUse === '否' || reviewUse === '否' || featureKnow === '否';
  // #endregion

  //#region 練習頁 變數宣告
  const [demoSlider, setDemoSlider] = useState(9);
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

  //AHP常數宣告--錯誤訊息
  const [errors, setErrors] = useState({
    lv1: '',
    lv2_1: '',
    lv2_2: '',
    lv2_3: '',
  });

  //AHP函式宣告--三個比較都被動過
  const isGroupCompleted = (groupKey) => {
    return Object.values(answers[groupKey]).every((item) => item.touched);
  };

  //AHP函式宣告--更新答案並清除該組錯誤訊息
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

  //AHP常數宣告--每組比較的三個順序
  const pairs = [
    ['AB', 'A', 'B'],
    ['AC', 'A', 'C'],
    ['BC', 'B', 'C'],
  ];

  //AHP常數宣告--radio位置與比例對應表
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

  //AHP常數宣告--radio位置與比例對應表
  const ratioOptions = [
    { value: 1, label: '9:1', displayLabel: '9', description: '絕對重要' },
    { value: 2, label: '8:1', displayLabel: '8', description: '' },
    { value: 3, label: '7:1', displayLabel: '7', description: '極為重要' },
    { value: 4, label: '6:1', displayLabel: '6', description: '' },
    { value: 5, label: '5:1', displayLabel: '5', description: '頗為重要' },
    { value: 6, label: '4:1', displayLabel: '4', description: '' },
    { value: 7, label: '3:1', displayLabel: '3', description: '稍微重要' },
    { value: 8, label: '2:1', displayLabel: '2', description: '' },
    { value: 9, label: '1:1', displayLabel: '1', description: '同等重要' },
    { value: 10, label: '1:2', displayLabel: '2', description: '' },
    { value: 11, label: '1:3', displayLabel: '3', description: '稍微重要' },
    { value: 12, label: '1:4', displayLabel: '4', description: '' },
    { value: 13, label: '1:5', displayLabel: '5', description: '頗為重要' },
    { value: 14, label: '1:6', displayLabel: '6', description: '' },
    { value: 15, label: '1:7', displayLabel: '7', description: '極為重要' },
    { value: 16, label: '1:8', displayLabel: '8', description: '' },
    { value: 17, label: '1:9', displayLabel: '9', description: '絕對重要' },
  ];

  //AHP函式宣告--選擇結果以比較倍數呈現
  const getImportanceText = (value, leftKey, rightKey) => {
    if (value === 9) {
      return (
        <>
          {leftKey} 與 {rightKey}
          {'\u00A0\u00A0'}
          <span className="font-semibold text-slate-900">同等重要</span>
        </>
      );
    }

    if (value < 9) {
      const times = 10 - value;
      return (
        <>
          {leftKey} 相較於 {rightKey}
          {'\u00A0\u00A0'}
          <span className="font-semibold text-slate-900">
            {times} 倍
          </span>
          重要
        </>
      );
    }

    const times = value - 8;
    return (
      <>
        {rightKey} 相較於 {leftKey}
        {'\u00A0\u00A0'}
        <span className="font-semibold text-slate-900">
          {times} 倍
        </span>
        重要
      </>
    );
  };

  //AHP函式宣告--將選項轉換為 AHP 比例
  const getAhpRatioFromValue = (value) => {
    if (value === 9) {
      return 1;
    }

    if (value < 9) {
      return 10 - value;
    }

    return 1 / (value - 8);
  };

  //AHP函式宣告--建立 3x3AHP成對比較矩陣
  const buildAhpMatrix = (groupKey) => {
    const ab = getAhpRatioFromValue(answers[groupKey].AB.value);
    const ac = getAhpRatioFromValue(answers[groupKey].AC.value);
    const bc = getAhpRatioFromValue(answers[groupKey].BC.value);

    return [
      [1, ab, ac],
      [1 / ab, 1, bc],
      [1 / ac, 1 / bc, 1],
    ];
  };

  //AHP函式宣告--計算 AHP 權重、CI、CR
  const calculateAhpResult = (groupKey) => {
    const matrix = buildAhpMatrix(groupKey);
    const n = 3;
    const ri = 0.58;

    const columnSums = [0, 0, 0];

    for (let col = 0; col < n; col += 1) {
      for (let row = 0; row < n; row += 1) {
        columnSums[col] += matrix[row][col];
      }
    }

    const normalizedMatrix = matrix.map((row) =>
      row.map((value, colIndex) => value / columnSums[colIndex])
    );

    const weights = normalizedMatrix.map((row) => {
      const rowSum = row.reduce((sum, value) => sum + value, 0);
      return rowSum / n;
    });

    const weightedSums = matrix.map((row) =>
      row.reduce((sum, value, colIndex) => sum + value * weights[colIndex], 0)
    );

    const lambdaValues = weightedSums.map(
      (weightedSum, index) => weightedSum / weights[index]
    );

    const lambdaMax =
      lambdaValues.reduce((sum, value) => sum + value, 0) / n;

    const ci = (lambdaMax - n) / (n - 1);
    const cr = ci / ri;

    return {
      matrix,
      weights,
      lambdaMax,
      ci,
      cr,
    };
  };

  //AHP函式宣告--取得某一題兩兩比較的方向
  const getComparisonDirection = (value, leftKey, rightKey) => {
    if (value < 9) {
      return [leftKey, rightKey];
    }

    if (value > 9) {
      return [rightKey, leftKey];
    }

    return null;
  };

  //AHP函式宣告--檢查是否出現循環比較
  const getCycleMessage = (groupKey) => {
    const directions = pairs
      .map(([pairKey, leftKey, rightKey]) =>
        getComparisonDirection(answers[groupKey][pairKey].value, leftKey, rightKey)
      )
      .filter(Boolean);

    const hasEdge = (from, to) =>
      directions.some(([edgeFrom, edgeTo]) => edgeFrom === from && edgeTo === to);

    const hasCycle =
      (hasEdge('A', 'B') && hasEdge('B', 'C') && hasEdge('C', 'A')) ||
      (hasEdge('B', 'A') && hasEdge('A', 'C') && hasEdge('C', 'B'));

    if (!hasCycle) {
      return '';
    }

    return '提醒：您的兩兩比較中可能出現循環關係，例如 A 高於 B、B 高於 C，但 C 又高於 A。若這符合您的真實想法，可以直接繼續。';
  };

  //AHP函式宣告--依據 CR 產生一致性提醒文字
  const getConsistencyMessage = (cr) => {
    if (cr <= 0.1) {
      return '';
    }

    if (cr <= 0.2) {
      return '提醒：目前三題兩兩比較之間可能存在一些判斷落差。若這符合您的真實想法，可以直接繼續。';
    }

    return '提醒：目前三題兩兩比較之間可能存在較明顯的判斷落差。若這符合您的真實想法，可以直接繼續；您也可以回頭確認三題比較是否符合原本想法。';
  };


  //常數宣告--排序題題號
  const [rankings, setRankings] = useState({
    lv1: ['A', 'B', 'C'],
    lv2_1: ['A', 'B', 'C'],
    lv2_2: ['A', 'B', 'C'],
    lv2_3: ['A', 'B', 'C'],
  });


  //#region 進度條部分
  //常數宣告--進度條步驟宣告
  const progressSteps = [
    'profile',
    'eligibility',
    'tutorial',
    'tutorialPractice',
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
  //函式宣告--進度條渲染
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
  //#endregion

  //AHP常數宣告--頁面內容宣告
  const ahpPages = {
    lv1: {
      title: '第 1 組：主要構面比較',
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
          description: '包含：評論長度、熵值（用詞多樣性）、評論雙向性(優缺點皆提及)',
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
          name: '評論雙向性(優缺點皆提及)',
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
  //AHP函式宣告--頁面內容比較結果視覺化呈現(防呆視覺化)
  const renderAhpSummaryCard = (groupKey) => {
    const group = ahpPages[groupKey];
    const completed = isGroupCompleted(groupKey);

    if (!completed) {
      return (
        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-700">
          <p className="font-medium text-slate-900">目前判斷結果摘要：</p>

          <p className="mt-2 text-slate-600">
            完成三題兩兩比較後，這裡會依您的回答整理出三項因素的相對比例。
            此摘要僅供您確認整體判斷方向，並不代表正確或錯誤。
          </p>

          <div className="mt-4 rounded-xl bg-white px-4 py-3 text-slate-500 ring-1 ring-slate-200">
            尚未完成三題比較。
          </div>
        </div>
      );
    }

    const ahpResult = calculateAhpResult(groupKey);
    const consistencyMessage = getConsistencyMessage(ahpResult.cr);
    const cycleMessage = getCycleMessage(groupKey);
    const itemKeys = ['A', 'B', 'C'];

    const weightItems = itemKeys.map((itemKey, index) => ({
      key: itemKey,
      name: group.items[itemKey].name,
      percent: ahpResult.weights[index] * 100,
    }));

    return (
      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-700">
        <p className="font-medium text-slate-900">目前判斷結果摘要：</p>

        <p className="mt-2 text-slate-600">
          以下比例是依您目前三題兩兩比較換算出的初步整理，並不代表正確或錯誤。
          若符合您的想法，可以直接繼續。
        </p>

        <div className="mt-4 flex h-10 w-full overflow-hidden rounded-xl bg-slate-200 text-xs font-semibold">
          {weightItems.map((item, index) => {
            const segmentClasses = [
              'bg-slate-900 text-white',
              'bg-slate-600 text-white',
              'bg-slate-300 text-slate-900',
            ];

            return (
              <div
                key={item.key}
                className={`flex items-center justify-center ${segmentClasses[index]}`}
                style={{ width: `${item.percent}%` }}
              >
                {item.percent >= 12
                  ? `${item.key} ${item.percent.toFixed(0)}%`
                  : item.key}
              </div>
            );
          })}
        </div>

        <div className="mt-4 space-y-1">
          {weightItems.map((item) => (
            <p key={item.key}>
              {item.key}. {item.name}：
              <span className="font-semibold text-slate-900">
                約 {item.percent.toFixed(1)}%
              </span>
            </p>
          ))}
        </div>

        {consistencyMessage && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
            <p className="font-medium text-amber-900">一致性提醒：</p>
            <p className="mt-2">{consistencyMessage}</p>
          </div>
        )}

        {cycleMessage && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
            <p className="font-medium text-amber-900">循環比較提醒：</p>
            <p className="mt-2">{cycleMessage}</p>
          </div>
        )}
      </div>
    );
  };
  //AHP函式宣告--頁面內容渲染
  const renderAhpPage = (groupKey, backButtonText = '回到上一頁') => {
    const group = ahpPages[groupKey];

    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12">
          <div className="w-full rounded-2xl bg-white p-4 sm:p-6 lg:p-8 shadow-sm ring-1 ring-slate-200">
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

              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="font-medium text-slate-900">排序題：</p>

                <p className="mt-2 text-slate-700">
                  請依照您直覺認為的重要程度，將下列三個因素排出第 1 名到第 3 名。
                  後續的比較題可依此排序作為參考。
                </p>

                <div className="mt-4 space-y-3">
                  {[0, 1, 2].map((rankIndex) => (
                    <div
                      key={rankIndex}
                      className="rounded-xl bg-white px-4 py-3 ring-1 ring-slate-200"
                    >
                      <label className="mb-2 block text-sm font-semibold text-slate-900">
                        第 {rankIndex + 1} 名
                      </label>

                      <select
                        value={rankings[groupKey][rankIndex]}
                        onChange={(e) => {
                          const selectedItem = e.target.value;

                          setRankings((prev) => {
                            const currentRanking = [...prev[groupKey]];
                            const oldItem = currentRanking[rankIndex];
                            const selectedIndex = currentRanking.indexOf(selectedItem);

                            currentRanking[rankIndex] = selectedItem;
                            currentRanking[selectedIndex] = oldItem;

                            return {
                              ...prev,
                              [groupKey]: currentRanking,
                            };
                          });
                        }}
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                      >
                        {Object.entries(group.items).map(([itemKey, item]) => (
                          <option key={itemKey} value={itemKey}>
                            {itemKey}. {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
                  <p className="font-medium text-slate-900">目前排序：</p>

                  <div className="mt-2 space-y-1">
                    {rankings[groupKey].map((itemKey, index) => (
                      <p key={itemKey}>
                        第 {index + 1} 名：{itemKey}. {group.items[itemKey].name}
                      </p>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            <div className="mt-8 w-full space-y-6">
              {pairs.map(([pairKey, leftKey, rightKey]) => {
                const left = group.items[leftKey];
                const right = group.items[rightKey];
                const currentValue = answers[groupKey][pairKey].value;

                return (
                  <div
                    key={pairKey}
                    className="w-full rounded-xl border border-slate-200 p-4 sm:p-5"
                  >
                    <div className="space-y-1 sm:space-y-0 sm:flex sm:items-center sm:gap-2">
                      <p className="text-sm font-medium text-slate-900">
                        {leftKey}. {left.name}
                      </p>

                      <p className="hidden text-xs font-medium uppercase tracking-wide text-slate-500 sm:block">
                        vs
                      </p>

                      <p className="text-sm font-medium text-slate-900">
                        {rightKey}. {right.name}
                      </p>
                    </div>

                    <div
                      className="mt-4 grid text-sm text-slate-700"
                      style={{ gridTemplateColumns: 'repeat(17, minmax(0, 1fr))' }}
                    >
                      <div className="col-start-1 text-center font-medium">
                        {leftKey}
                      </div>

                      <div className="col-start-17 text-center font-medium">
                        {rightKey}
                      </div>
                    </div>

                    <div
                      className="mt-4 grid gap-0"
                      style={{ gridTemplateColumns: 'repeat(17, minmax(0, 1fr))' }}
                    >
                      {ratioOptions.map((option) => (
                        <label
                          key={option.value}
                          className="flex cursor-pointer flex-col items-center justify-center gap-1 px-0 py-2"
                        >
                          <span
                            className={
                              currentValue === option.value
                                ? 'min-h-10 lg:min-h-12 text-center text-[9px] lg:text-[11px] font-semibold leading-tight text-slate-900 [writing-mode:vertical-rl]'
                                : 'min-h-10 lg:min-h-12 text-center text-[9px] lg:text-[11px] leading-tight text-slate-500 [writing-mode:vertical-rl]'
                            }
                          >
                            {option.description}
                          </span>

                          <input
                            type="radio"
                            name={`${groupKey}-${pairKey}`}
                            value={option.value}
                            checked={currentValue === option.value}
                            onChange={() => {
                              updateAnswer(groupKey, pairKey, option.value);
                            }}
                            className="h-3 w-3 lg:h-4 lg:w-4 accent-slate-900"
                          />

                          <span
                            className={
                              currentValue === option.value
                                ? 'text-[10px] lg:text-xs font-semibold leading-none text-slate-900'
                                : 'text-[10px] lg:text-xs leading-none text-slate-500'
                            }
                          >
                            {option.displayLabel}
                          </span>
                        </label>
                      ))}
                    </div>


                    <div className="mt-3 rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
                      <p>
                        目前選擇：
                        <span className="font-semibold text-slate-900">
                          {sliderRatioMap[currentValue]}
                        </span>
                      </p>

                      <p className="mt-1 text-slate-500">
                        {getImportanceText(currentValue, leftKey, rightKey)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {renderAhpSummaryCard(groupKey)}

            {errors[groupKey] && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm leading-7 text-red-700">
                {errors[groupKey]}
              </div>
            )}

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
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

  //AHP常數宣告--完成頁面內容
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
  //AHP函式宣告--完成頁面內容渲染
  const renderDonePage = (doneKey) => {
    const page = donePages[doneKey];
    const groupKey = page.groupKey;

    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
          <div className="w-full rounded-2xl bg-white p-4 sm:p-6 lg:p-8 shadow-sm ring-1 ring-slate-200">
            {renderProgressBar()}

            <h2 className="text-2xl font-bold tracking-tight">
              {page.title}
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-7 text-slate-700">
              <p>{page.description}</p>

              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4">
                <p className="font-medium text-amber-900">作答提醒：</p>
                <p className="mt-2 text-amber-800">
                  到下一頁前，請您回頭想想剛才三題兩兩比較結果是否合理，
                  並確認整體判斷是否符合您的真實想法。
                </p>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-xl bg-slate-100 px-4 py-4">
                  <p className="font-medium text-slate-900">您剛才的排序結果：</p>

                  <div className="mt-2 space-y-1">
                    {rankings[groupKey].map((itemKey, index) => (
                      <p key={itemKey}>
                        第 {index + 1} 名：{itemKey}. {ahpPages[groupKey].items[itemKey].name}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl bg-slate-100 px-4 py-4">
                  <p className="font-medium text-slate-900">您剛才的兩兩比較結果：</p>

                  <div className="mt-2 space-y-2">
                    <div>
                      <p className="font-medium text-slate-900">
                        A vs B = {sliderRatioMap[answers[groupKey].AB.value]}
                      </p>
                      <p className="text-slate-500">
                        {getImportanceText(answers[groupKey].AB.value, 'A', 'B')}
                      </p>
                    </div>

                    <div>
                      <p className="font-medium text-slate-900">
                        A vs C = {sliderRatioMap[answers[groupKey].AC.value]}
                      </p>
                      <p className="text-slate-500">
                        {getImportanceText(answers[groupKey].AC.value, 'A', 'C')}
                      </p>
                    </div>

                    <div>
                      <p className="font-medium text-slate-900">
                        B vs C = {sliderRatioMap[answers[groupKey].BC.value]}
                      </p>
                      <p className="text-slate-500">
                        {getImportanceText(answers[groupKey].BC.value, 'B', 'C')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {renderAhpSummaryCard(groupKey)}

            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
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

  //常數宣告--送出狀態與錯誤訊息
  const [submitStatus, setSubmitStatus] = useState('idle');
  const [submitError, setSubmitError] = useState('');

  //AHP函式宣告--整理AHP結果以便送出
  const buildAhpResults = () => {
    const groupKeys = ['lv1', 'lv2_1', 'lv2_2', 'lv2_3'];

    return groupKeys.reduce((result, groupKey) => {
      const ahpResult = calculateAhpResult(groupKey);
      const group = ahpPages[groupKey];
      const itemKeys = ['A', 'B', 'C'];

      result[groupKey] = {
        weights: itemKeys.reduce((weightResult, itemKey, index) => {
          weightResult[itemKey] = {
            name: group.items[itemKey].name,
            weight: ahpResult.weights[index],
            percent: ahpResult.weights[index] * 100,
          };

          return weightResult;
        }, {}),
        lambdaMax: ahpResult.lambdaMax,
        ci: ahpResult.ci,
        cr: ahpResult.cr,
        hasCycle: Boolean(getCycleMessage(groupKey)),
      };

      return result;
    }, {});
  };
  //常數宣告--問卷送出資料整理
  const buildSubmitData = () => {
    return {
      submittedAt: new Date().toISOString(),

      profile: {
        gender,
        age,
        region,
        education,
      },

      eligibility: {
        rpgSteamUse,
        reviewUse,
        featureKnow,
      },

      rankings,

      answers,

      ahpResults: buildAhpResults(),

      contact: {
        email,
        feedback,
      },
    };
  };

  //函式宣告--問卷送出
  const submitQuestionnaire = async () => {
    setSubmitStatus('submitting');
    setSubmitError('');

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(buildSubmitData()),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || '送出失敗');
      }

      setSubmitStatus('success');
    } catch (error) {
      console.error(error);
      setSubmitStatus('error');
      setSubmitError('資料送出時發生問題，請稍後再試。');
    }
  };

  //函式宣告--問卷重置
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
    setDemoSlider(9);

    setEmail('');
    setFeedback('');

    setSubmitStatus('idle');
    setSubmitError('');

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

    setRankings({
      lv1: ['A', 'B', 'C'],
      lv2_1: ['A', 'B', 'C'],
      lv2_2: ['A', 'B', 'C'],
      lv2_3: ['A', 'B', 'C'],
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
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-12">
          <div className="rounded-2xl bg-white p-5 sm:p-8 shadow-sm ring-1 ring-slate-200">
            <h1 className="text-3xl font-bold tracking-tight">
              Steam RPG 推薦評論的有效性評估
            </h1>

            <div className="mt-6 space-y-6 text-sm leading-7 text-slate-700">
              <div className="space-y-3">
                <p>您好：</p>
                <p>
                  感謝您撥空填寫本問卷。這是一份關於 Steam 平台 RPG 推薦評論有效性評估的碩士論文研究問卷。
                  主要希望了解玩家在閱讀 Steam RPG 遊戲推薦評論時，哪些因素會影響其對評論有效性的判斷。
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="font-semibold text-slate-900">
                  一、研究目的與名詞說明
                </p>
                <p className="mt-3">
                  本研究所稱之「評論有效性」，係指評論
                  <span className="font-semibold text-slate-900">
                    降低資訊不對稱，從而強化潛在購買者之決策支持能力
                  </span>
                  。
                </p>

                <p className="mt-2">
                  換言之，一則評論
                  <span className="font-semibold text-slate-900">
                    是否能幫助玩家更快理解遊戲內容，並在購買前做出較可靠的判斷
                  </span>
                  。
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="font-semibold text-slate-900">
                  二、填答說明（成對比較問卷型式）
                </p>
                <p className="mt-3">
                  問卷中會請您比較兩項因素，例如 A 與 B，請選出您認為哪一項對判斷評論是否有效更重要，以及重要程度。
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="font-semibold text-slate-900">
                  三、填答資格與時間
                </p>
                <div className="mt-3 space-y-2">
                  <p>
                    <span className="font-medium text-slate-900">填答資格：</span>
                    年滿 18 歲，且具 Steam 使用經驗者。
                  </p>
                  <p>
                    <span className="font-medium text-slate-900">填答時間：</span>
                    約 15 分鐘。
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="font-semibold text-slate-900">
                  四、資料使用與隱私保護
                </p>
                <p className="mt-3">
                  您的填答資料僅供學術研究與統計分析使用，研究結果將以整體彙整方式呈現，不會揭露個別回答。
                </p>
                <p className="mt-2">
                  若您欲參與抽獎，需自願留下電子郵件。電子郵件僅作為抽獎通知與獎項聯繫用途，不會用於研究分析或公開呈現。
                </p>
              </div>

              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4">
                <p className="font-semibold text-amber-900">
                  五、填答獎勵
                </p>
                <p className="mt-3 text-amber-800">
                  凡完整填答並符合研究分析條件者，即可參加抽獎。
                </p>
                <p className="mt-2 text-amber-800">
                  獎項為：Steam 遊戲《Slay the Spire 2（殺戮尖塔 2）》4 份。
                </p>
                <div className="mt-3 space-y-1 text-xs leading-6 text-amber-700">
                  <p>＊如得獎者已擁有該遊戲，可更換為等值遊戲。</p>
                  <p>＊得獎名單將於問卷回收後以電腦隨機抽出，並以填答者所留電子郵件個別通知。</p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="font-semibold text-slate-900">
                  研究聯絡方式
                </p>
                <p className="mt-3">
                  若您對本研究或問卷內容有任何疑問，歡迎聯絡研究者：
                </p>
                <div className="mt-3 space-y-1">
                  <p>指導教授：吳帆 博士</p>
                  <p>研究生：王煜凱</p>
                  <p>聯絡信箱：jason.763226@gmail.com</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setStep('profile')}
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                開始填答
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (step === 'profile') {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-12">
          <div className="rounded-2xl bg-white p-5 sm:p-8 shadow-sm ring-1 ring-slate-200">
            {renderProgressBar()}
            <h2 className="text-2xl font-bold tracking-tight">基本資料頁</h2>

            <p className="mt-4 text-base leading-7 text-slate-700">
              請先填寫基本資料。
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-3 block text-sm lg:text-base font-medium text-slate-900">
                  生理性別
                </label>

                <div className="space-y-2 text-sm lg:text-base text-slate-700">
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
                <label className="mb-3 block text-sm lg:text-base font-medium text-slate-900">
                  年齡
                </label>

                <div className="space-y-2 text-sm lg:text-base text-slate-700">
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
                <label className="mb-3 block text-sm lg:text-base font-medium text-slate-900">
                  所在地區
                </label>

                <div className="space-y-2 text-sm lg:text-base text-slate-700">
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
                <label className="mb-3 block text-sm lg:text-base font-medium text-slate-900">
                  最高學歷
                </label>

                <div className="space-y-2 text-sm lg:text-base text-slate-700">
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


            <div className="mt-8 flex flex-col sm:flex-row gap-3">
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
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-12">
          <div className="rounded-2xl bg-white p-5 sm:p-8 shadow-sm ring-1 ring-slate-200">
            {renderProgressBar()}
            <h2 className="text-2xl font-bold tracking-tight">填答條件確認</h2>

            <p className="mt-4 text-base leading-7 text-slate-700">
              請先確認您符合本研究的填答條件。
            </p>

            <div className="mt-6 space-y-4">
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-sm lg:text-base font-medium text-slate-900">
                  1. 過去一年內，您是否曾接觸 RPG 類型遊戲，且曾使用 Steam 平台瀏覽或購買遊戲？
                </p>

                <div className="mt-3 space-y-2 text-sm lg:text-base text-slate-700">
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
                <p className="text-sm lg:text-base font-medium text-slate-900">
                  2. 您是否曾閱讀 Steam 上的遊戲評論，並將其作為是否購買遊戲的參考？
                </p>

                <div className="mt-3 space-y-2 text-sm lg:text-base text-slate-700">
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
                <p className="text-sm lg:text-base font-medium text-slate-900">
                  3. 您是否了解 Steam 評論區的常見功能，例如「推薦／不推薦」、「有幫助」或「有趣」等互動機制？
                </p>

                <img
                  src="/images/SteamRecommendReview.jpg"
                  alt="Steam 評論區常見功能示意圖1"
                  className="mt-4 w-full rounded-xl border border-slate-200"
                />
                <img
                  src="/images/SteamReviewReact.jpg"
                  alt="Steam 評論區常見功能示意圖2"
                  className="mt-4 w-full rounded-xl border border-slate-200"
                />

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  圖片取自Steam官網
                </p>

                <div className="mt-3 space-y-2 text-sm lg:text-base text-slate-700">
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



            <div className="mt-8 flex flex-col sm:flex-row gap-3">
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
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-12">
          <div className="rounded-2xl bg-white p-5 sm:p-8 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-2xl font-bold tracking-tight">感謝您的填答</h2>

            <p className="mt-4 text-base leading-7 text-slate-700">
              由於本研究對填答對象設有特定條件，您目前不在本次研究的適用範圍內，因此問卷到此結束。
            </p>

            <p className="mt-4 text-base leading-7 text-slate-700">
              仍誠摯感謝您的參與與協助。
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
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
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12">
          <div className="w-full rounded-2xl bg-white p-4 sm:p-6 lg:p-8 shadow-sm ring-1 ring-slate-200">
            {renderProgressBar()}
            <h2 className="text-2xl font-bold tracking-tight">問卷作答說明</h2>

            <div className="mt-6 space-y-6 text-sm leading-7 text-slate-700">
              <div className="space-y-3">
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
                  本問卷中的比例選項不只代表您認為哪一個因素較重要，也代表兩者之間的重要程度差距有多大。
                  因此，作答時請不要只判斷左邊或右邊較重要，也請同時考慮兩者之間的重要倍數差距。
                </p>
              </div>

              <div className="rounded-xl bg-slate-100 px-4 py-4">
                <p className="font-medium text-slate-900">作答方式如下：</p>
                <div className="mt-3 space-y-1">
                  <p>• 左側 9–2 代表前者較重要</p>
                  <p>• 中間 1 代表兩者一樣重要</p>
                  <p>• 右側 2–9 代表後者較重要</p>
                  <p>• 選得越靠近兩側，代表您認為兩者的重要差距越大</p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 px-4 py-4">
                <p className="font-medium text-slate-900">
                  本問卷中，17 個選項分別對應兩側內容的重要程度比例：
                </p>

                <p className="mt-3 break-words text-slate-700">
                  9:1、8:1、7:1、6:1、5:1、4:1、3:1、2:1、1:1、1:2、1:3、1:4、1:5、1:6、1:7、1:8、1:9
                </p>

                <div className="mt-5 -mx-2 rounded-xl bg-slate-100 px-2 py-4 sm:mx-0 sm:px-4">
                  <p className="text-sm font-medium text-slate-900">
                    您可以先試著選擇下方比例選項，熟悉比例變化：
                  </p>

                  <div className="mt-4 flex items-center justify-between gap-3 text-sm text-slate-700">
                    <div className="font-medium">左側因素</div>
                    <div className="text-right font-medium">右側因素</div>
                  </div>

                  <div
                    className="mt-4 -mx-2 grid gap-0 sm:mx-0"
                    style={{ gridTemplateColumns: 'repeat(17, minmax(0, 1fr))' }}
                  >
                    {ratioOptions.map((option) => (
                      <label
                        key={option.value}
                        className="flex cursor-pointer flex-col items-center justify-center gap-1 px-0 py-2"
                      >
                        <span
                          className={
                            demoSlider === option.value
                              ? 'min-h-10 lg:min-h-12 text-center text-[9px] lg:text-[11px] font-semibold leading-tight text-slate-900 [writing-mode:vertical-rl]'
                              : 'min-h-10 lg:min-h-12 text-center text-[9px] lg:text-[11px] leading-tight text-slate-500 [writing-mode:vertical-rl]'
                          }
                        >
                          {option.description}
                        </span>

                        <input
                          type="radio"
                          name="demo-ahp-scale"
                          value={option.value}
                          checked={demoSlider === option.value}
                          onChange={() => setDemoSlider(option.value)}
                          className="h-3 w-3 lg:h-4 lg:w-4 accent-slate-900"
                        />

                        <span
                          className={
                            demoSlider === option.value
                              ? 'text-[10px] lg:text-xs font-semibold leading-none text-slate-900'
                              : 'text-[10px] lg:text-xs leading-none text-slate-500'
                          }
                        >
                          {option.displayLabel}
                        </span>
                      </label>
                    ))}
                  </div>

                  <div className="mt-3 rounded-xl bg-white px-4 py-3 text-sm text-slate-700">
                    <p>
                      目前選擇：
                      <span className="font-semibold text-slate-900">
                        {sliderRatioMap[demoSlider]}
                      </span>
                    </p>

                    <p className="mt-1 text-slate-500">
                      {getImportanceText(demoSlider, '左側因素', '右側因素')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 px-4 py-4">
                <p className="font-medium text-slate-900">例如：</p>
                <div className="mt-3 space-y-2">
                  <p>
                    若您選擇右側的 <span className="font-semibold">7</span>，表示您認為
                    <span className="font-semibold">右側因素</span>
                    相較於
                    <span className="font-semibold">左側因素</span>
                    更重要。
                  </p>
                  <p>
                    在本問卷的換算中，右側的 <span className="font-semibold">7</span> 對應的比例為
                    <span className="font-semibold"> 1:7 </span>
                    ，表示右側因素相較於左側因素極為重要。
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4">
                <p className="font-medium text-emerald-900">作答前提醒：</p>
                <p className="mt-2 text-emerald-800">
                  本問卷中的比例選項具有比例意義，請不要只判斷左右方向，也請同時考慮兩者之間的重要倍數差距。
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setStep('eligibility')}
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                回到篩選頁
              </button>

              <button
                onClick={() => setStep('tutorialPractice')}
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                下一步：進入練習題
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (step === 'tutorialPractice') {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12">
          <div className="w-full rounded-2xl bg-white p-4 sm:p-6 lg:p-8 shadow-sm ring-1 ring-slate-200">
            {renderProgressBar()}
            <h2 className="text-2xl font-bold tracking-tight">練習題</h2>

            <div className="mt-6 space-y-4 text-sm leading-7 text-slate-700">
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
                請您依據這些比較關係，判斷最後一組因素之間何者較重要，並選擇您認為較合理的比例。
              </p>
            </div>

            <div className="mt-8 space-y-4">
              <div className="rounded-xl border border-slate-200 p-3 sm:p-4">
                <p className="text-sm font-medium text-slate-900">
                  <span className="block">已知比較 1：</span>
                  <span className="mt-1 block">A 劇情有深度 vs B 畫面表現出眾</span>
                </p>
                <p className="mt-2 text-sm text-slate-700">
                  A 比 B 稍微重要 (對應左側3)
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-3 sm:p-4">
                <p className="text-sm font-medium text-slate-900">
                  <span className="block">已知比較 2：</span>
                  <span className="mt-1 block">A 劇情有深度 vs C 音樂動聽</span>
                </p>
                <p className="mt-2 text-sm text-slate-700">
                  A 比 C 極為重要 (對應左側7)
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-3 sm:p-4">
                <p className="text-sm font-medium text-slate-900">
                  <span className="block">請完成比較 3：</span>
                  <span className="mt-1 block">B 畫面表現出眾 vs C 音樂動聽</span>
                </p>

                <div className="mt-4 flex items-center justify-between gap-3 text-sm text-slate-700">
                  <div className="font-medium">B 畫面表現出眾</div>
                  <div className="text-right font-medium">C 音樂動聽</div>
                </div>

                <div
                  className="mt-4 -mx-2 grid gap-0 sm:mx-0"
                  style={{ gridTemplateColumns: 'repeat(17, minmax(0, 1fr))' }}
                >
                  {ratioOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex cursor-pointer flex-col items-center justify-center gap-1 px-0 py-2"
                    >
                      <span
                        className={
                          practiceBC === option.value
                            ? 'min-h-10 lg:min-h-12 text-center text-[9px] lg:text-[11px] font-semibold leading-tight text-slate-900 [writing-mode:vertical-rl]'
                            : 'min-h-10 lg:min-h-12 text-center text-[9px] lg:text-[11px] leading-tight text-slate-500 [writing-mode:vertical-rl]'
                        }
                      >
                        {option.description}
                      </span>

                      <input
                        type="radio"
                        name="practice-bc-scale"
                        value={option.value}
                        checked={practiceBC === option.value}
                        onChange={() => setPracticeBC(option.value)}
                        className="h-3 w-3 lg:h-4 lg:w-4 accent-slate-900"
                      />

                      <span
                        className={
                          practiceBC === option.value
                            ? 'text-[10px] lg:text-xs font-semibold leading-none text-slate-900'
                            : 'text-[10px] lg:text-xs leading-none text-slate-500'
                        }
                      >
                        {option.displayLabel}
                      </span>
                    </label>
                  ))}
                </div>

                <div className="mt-2 text-center text-xs text-slate-500">
                  中間 1 = 兩者一樣重要
                </div>

                <div className="mt-3 rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
                  <p>
                    目前選擇：
                    <span className="font-semibold text-slate-900">
                      {sliderRatioMap[practiceBC]}
                    </span>
                  </p>

                  <p className="mt-1 text-slate-500">
                    {getImportanceText(practiceBC, 'B', 'C')}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setStep('tutorial')}
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                回到作答說明
              </button>

              <button
                onClick={() => {
                  if (practiceBC >= 5 && practiceBC <= 8) {
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
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12">
          <div className="w-full rounded-2xl bg-white p-4 sm:p-6 lg:p-8 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-2xl font-bold tracking-tight">邏輯補充說明</h2>

            <p className="mt-4 text-base leading-7 text-slate-700">
              在這個練習題中，前兩組比較結果已顯示：
            </p>

            <div className="mt-6 space-y-3 rounded-xl bg-slate-100 px-4 py-4 text-sm leading-7 text-slate-700">
              <p>
                A 相較於 B：
                <span className="font-semibold text-slate-900"> 稍微重要</span>
                ，約可理解為
                <span className="font-semibold text-slate-900"> 3 倍重要</span>
              </p>

              <p>
                A 相較於 C：
                <span className="font-semibold text-slate-900"> 極為重要</span>
                ，約可理解為
                <span className="font-semibold text-slate-900"> 7 倍重要</span>
              </p>
            </div>

            <div className="mt-6 space-y-4 text-sm leading-7 text-slate-700">
              <p>
                在 AHP 的兩兩比較中，判斷結果應盡量維持一致性。
                若 A 比 B 重要約 3 倍，而 A 比 C 重要約 7 倍，
                則 B 與 C 的差距應該介於兩者之間。
              </p>

              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="font-medium text-slate-900">簡化理解：</p>
                <p className="mt-2">
                  A / B ≈ 3，A / C ≈ 7，因此 B / C 約為 7 ÷ 3，也就是約 2.3。
                </p>
              </div>

              <p>
                因此，在 B 與 C 的比較中，較合理的判斷會是：
                <span className="font-semibold text-slate-900">
                  {' '}
                  B 相較於 C 較重要
                </span>
                ，且重要程度通常不應過於極端。
              </p>

              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4">
                <p className="font-medium text-emerald-900">建議選擇範圍：</p>
                <p className="mt-2 text-emerald-800">
                  選擇 B 相較於 C 約
                  <span className="font-semibold"> 2～5 倍重要</span>
                  的選項，也就是下方比例中的
                  <span className="font-semibold"> 2:1、3:1、4:1、5:1</span>
                  。
                </p>
              </div>

              <p>
                換句話說，三者的整體關係通常較接近：
                <span className="font-semibold text-slate-900"> A &gt; B &gt; C</span>
                ，但 B 與 C 的差距不應比 A 與 C 的差距還要極端。
              </p>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setStep('tutorialPractice')}
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
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-12">
          <div className="rounded-2xl bg-white p-5 sm:p-8 shadow-sm ring-1 ring-slate-200">
            {renderProgressBar()}

            <h2 className="text-2xl font-bold tracking-tight">正式作答開始</h2>

            <p className="mt-4 text-sm leading-7 text-slate-700">
              接下來將進入正式 AHP 兩兩比較題。請依照您的實際經驗與直覺判斷，
              評估各項因素對於 Steam RPG 推薦評論有效性的相對重要程度。
            </p>

            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4">
              <p className="font-medium text-amber-900">作答提醒：</p>
              <p className="mt-2 text-sm leading-7 text-amber-800">
                請不要只判斷左右哪一邊較重要，也請
                <span className="font-semibold text-amber-900">
                  同時考慮兩者之間的重要倍數差距
                </span>
                。
              </p>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setStep('tutorialPractice')}
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
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-12">
          <div className="rounded-2xl bg-white p-5 sm:p-8 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-2xl font-bold tracking-tight">問卷已完成</h2>

            <p className="mt-4 text-base leading-7 text-slate-700">
              感謝您的填答。您已完成本問卷所有 AHP 兩兩比較題。
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-3 block text-sm font-medium text-slate-900">
                  Mail（若是不參加抽獎則可以不用填）
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="請填入文字"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                />
              </div>

              <div>
                <label className="mb-3 block text-sm font-medium text-slate-900">
                  意見回饋，有任何想法或問題都歡迎提出。
                </label>

                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="請填入文字"
                  rows="4"
                  className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                />
              </div>
            </div>

            <div className="mt-8 flex flex-col items-center justify-center gap-3">
              {submitError && (
                <div className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm leading-7 text-red-700">
                  {submitError}
                </div>
              )}

              {submitStatus === 'success' ? (
                <>
                  <div className="w-full rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm leading-7 text-emerald-800">
                    您的問卷資料已成功送出，感謝您的填答。
                  </div>

                  <button
                    onClick={resetQuestionnaire}
                    className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    回到首頁
                  </button>
                </>
              ) : (
                <button
                  onClick={submitQuestionnaire}
                  disabled={submitStatus === 'submitting'}
                  className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitStatus === 'submitting' ? '送出中...' : '送出問卷'}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-12">
        <div className="rounded-2xl bg-white p-5 sm:p-8 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-2xl font-bold tracking-tight">頁面狀態錯誤</h2>
          <p className="mt-4 text-sm leading-7 text-slate-700">
            目前 step 沒有對應到任何頁面，請檢查 setStep 的名稱是否拼寫正確。
          </p>
        </div>
      </div>
    </main>
  );

}