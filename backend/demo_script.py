from app.session import InvestigationSession
from app.inference import run_bayesian_inference
from app.sampling import recommend_next_samples
from app.ml_crosscheck import compute_ml_crosscheck
from app.ai_report import build_evidence_package, generate_rule_based_fallback_report

print("=== STARTING SCRIPTED INVESTIGATION DEMO (Seed 42) ===")
sess = InvestigationSession(seed=42, source_type="junction")
print(f"1. Session Initialized. Total nodes: {len(sess.network_data['nodes'])}, Active sensors: {len(sess.sensors)}")

# Advance simulation 6 steps
sess.advance(6)
print(f"2. Advanced to step 6. Status: {sess.status}, Active alert count: {sess.get_active_alert_count()}")
for r in sess.get_latest_sensor_readings():
    if r["is_alert"]:
        print(f"   [ALERT] Sensor {r['node_id']}: {r['value']} umhos/cm (Threshold: {r['threshold']})")

# Run inference
bayes_res = run_bayesian_inference(sess.get_public_observations(), sess.current_step)
print("3. Bayesian Source Ranking:")
for cand in bayes_res["top_candidates"]:
    print(f"   Rank #{cand['rank']}: {cand['node_id']} ({cand['node_type']}) - {round(cand['probability']*100, 1)}% | {cand['path_summary']}")
print(f"   Entropy: {bayes_res['entropy']} bits | Uncertainty: {bayes_res['uncertainty_level']}")

# ML cross-check
ml_res = compute_ml_crosscheck(sess.get_public_observations(), bayes_res["top_candidates"][0]["node_id"])
print(f"4. ML Cross-Check Second Opinion: {ml_res['top_pick']} (Confidence: {ml_res['confidence']*100:.1f}%, Agrees: {ml_res['agrees_with_bayes']}, Held-out Acc: {ml_res['held_out_accuracy']*100:.1f}%)")

# Optimal Sampling
rec_res = recommend_next_samples(bayes_res["full_ranking"], bayes_res["entropy"], sess.samples_taken, sess.sample_budget)
best_node = rec_res["recommended_node"]["node_id"]
print(f"5. Optimal Sample Recommendation: {best_node} (Expected Info Gain: {rec_res['recommended_node']['expected_information_gain']} bits)")
print(f"   Reason: {rec_res['recommended_node']['reason']}")

# Execute grab sample
sample_res = sess.execute_sample(best_node)
print(f"6. Executed Grab Sample at {best_node}: Reading={sample_res['reading']} umhos/cm, Alert={sample_res['is_alert']}, Budget remaining={sample_res['budget_remaining']}")

# Re-run inference after sample
bayes_after = run_bayesian_inference(sess.get_public_observations(), sess.current_step)
print("7. Updated Bayesian Ranking after Field Sample:")
for cand in bayes_after["top_candidates"]:
    print(f"   Rank #{cand['rank']}: {cand['node_id']} - {round(cand['probability']*100, 1)}%")
diff_ent = round(bayes_res["entropy"] - bayes_after["entropy"], 2)
print(f"   Updated Entropy: {bayes_after['entropy']} bits (Entropy reduction: {diff_ent} bits)")

# Reveal Ground Truth
top1_pick = bayes_after["top_candidates"][0]["node_id"]
reveal_res = sess.reveal(top1_candidate=top1_pick)
print("8. REVEAL GROUND TRUTH:")
print(f"   True Source: {reveal_res['true_source']} ({reveal_res['true_source_type']})")
print(f"   Onset Step: {reveal_res['onset_step']}")
print(f"   Top-1 Pick: {top1_pick}")
print(f"   Is Top-1 Correct?: {reveal_res['is_top1_correct']}")
print(f"   Hop Error Distance: {reveal_res['hop_error']}")
print(f"   Samples Used: {reveal_res['samples_used']}")
print(f"   Spread Reach: {len(reveal_res['true_spread_nodes'])} downstream nodes")
print("=== SCRIPTED INVESTIGATION DEMO COMPLETED SUCCESSFULLY ===")
