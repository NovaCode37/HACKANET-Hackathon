def get_threshold(result_score: float) -> float:
    if result_score >= 8.0:
        return 0.3
    elif result_score >= 7.0:
        return 0.4
    elif result_score >= 6.0:
        return 0.5
    else:
        return 0.6

def classify_accuracy(referee_score: float, result_score: float) -> str:
    deviation = abs(referee_score - result_score)
    if deviation == 0:
        return "bullseye"
    elif deviation <= get_threshold(result_score):
        return "acceptable"
    else:
        return "serious"

def calc_accuracy_percent(assessments: list) -> float:
    if len(assessments) == 0:
        return 0.0

    counter = 0
    for a in assessments:
        label = classify_accuracy(a.referee_assessment, a.result_type_assessment)
        if label != "serious":
            counter += 1

    return counter / len(assessments) * 100


def calc_exec_art_accuracy(assessments: list) -> tuple[float, float]:
    exec_ok = 0
    exec_total = 0
    art_ok = 0
    art_total = 0
    for a in assessments:
        label = classify_accuracy(a.referee_assessment, a.result_type_assessment)
        if a.type == "EXECUTION":
            exec_total += 1
            if label != "serious":
                exec_ok += 1
        elif a.type == "ARTISTIC":
            art_total += 1
            if label != "serious":
                art_ok += 1
    exec_acc = round(exec_ok / exec_total * 100, 1) if exec_total else 0
    art_acc = round(art_ok / art_total * 100, 1) if art_total else 0
    return exec_acc, art_acc
