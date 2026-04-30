import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
  try {
    const data = await request.json();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !supabaseSecretKey) {
      return Response.json(
        {
          success: false,
          message: 'Supabase environment variables are missing.',
        },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseSecretKey);

    const { error } = await supabase.from('responses').insert({
      gender: data.profile?.gender ?? '',
      age: data.profile?.age ?? '',
      region: data.profile?.region ?? '',
      education: data.profile?.education ?? '',

      rpg_steam_use: data.eligibility?.rpgSteamUse ?? '',
      review_use: data.eligibility?.reviewUse ?? '',
      feature_know: data.eligibility?.featureKnow ?? '',

      email: data.contact?.email ?? '',
      feedback: data.contact?.feedback ?? '',

      lv1_ranking: data.rankings?.lv1 ?? null,
      lv2_1_ranking: data.rankings?.lv2_1 ?? null,
      lv2_2_ranking: data.rankings?.lv2_2 ?? null,
      lv2_3_ranking: data.rankings?.lv2_3 ?? null,

      lv1_ab: data.answers?.lv1?.AB?.value ?? null,
      lv1_ac: data.answers?.lv1?.AC?.value ?? null,
      lv1_bc: data.answers?.lv1?.BC?.value ?? null,

      lv2_1_ab: data.answers?.lv2_1?.AB?.value ?? null,
      lv2_1_ac: data.answers?.lv2_1?.AC?.value ?? null,
      lv2_1_bc: data.answers?.lv2_1?.BC?.value ?? null,

      lv2_2_ab: data.answers?.lv2_2?.AB?.value ?? null,
      lv2_2_ac: data.answers?.lv2_2?.AC?.value ?? null,
      lv2_2_bc: data.answers?.lv2_2?.BC?.value ?? null,

      lv2_3_ab: data.answers?.lv2_3?.AB?.value ?? null,
      lv2_3_ac: data.answers?.lv2_3?.AC?.value ?? null,
      lv2_3_bc: data.answers?.lv2_3?.BC?.value ?? null,

      rankings: data.rankings ?? null,
      answers: data.answers ?? null,
      ahp_results: data.ahpResults ?? null,

      submitted_at: data.submittedAt ?? new Date().toISOString(),
    });

    if (error) {
      console.error('Supabase insert error:', error);

      return Response.json(
        {
          success: false,
          message: 'Failed to save response.',
        },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      message: 'Response saved successfully.',
    });
  } catch (error) {
    console.error('Submit API error:', error);

    return Response.json(
      {
        success: false,
        message: 'Unexpected server error.',
      },
      { status: 500 }
    );
  }
}