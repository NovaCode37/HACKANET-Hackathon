from dataclasses import dataclass
from app.services.accuracy import (
    get_threshold,
    classify_accuracy,
    calc_accuracy_percent,
    calc_exec_art_accuracy,
)

@dataclass
class FakeAssessment:
    referee_assessment: float
    result_type_assessment: float
    type: str = "EXECUTION"

def test_threshold_high():
    assert get_threshold(9.0) == 0.3
    assert get_threshold(8.0) == 0.3

def test_threshold_medium():
    assert get_threshold(7.5) == 0.4
    assert get_threshold(7.0) == 0.4

def test_threshold_low():
    assert get_threshold(6.5) == 0.5
    assert get_threshold(5.0) == 0.6

def test_classify_bullseye():
    assert classify_accuracy(8.0, 8.0) == "bullseye"

def test_classify_acceptable():
    assert classify_accuracy(8.2, 8.0) == "acceptable"
    assert classify_accuracy(7.7, 8.0) == "acceptable"

def test_classify_serious():
    assert classify_accuracy(9.0, 8.0) == "serious"
    assert classify_accuracy(7.0, 8.0) == "serious"

def test_calc_accuracy_empty():
    assert calc_accuracy_percent([]) == 0.0

def test_calc_accuracy_all_bullseye():
    items = [FakeAssessment(8.0, 8.0), FakeAssessment(7.0, 7.0)]
    assert calc_accuracy_percent(items) == 100.0

def test_calc_accuracy_half_serious():
    items = [
        FakeAssessment(8.0, 8.0),
        FakeAssessment(9.5, 8.0),
    ]
    assert calc_accuracy_percent(items) == 50.0

def test_calc_exec_art_empty():
    assert calc_exec_art_accuracy([]) == (0, 0)

def test_calc_exec_art_only_execution():
    items = [
        FakeAssessment(8.0, 8.0, type="EXECUTION"),
        FakeAssessment(9.5, 8.0, type="EXECUTION"),
    ]
    exec_acc, art_acc = calc_exec_art_accuracy(items)
    assert exec_acc == 50.0
    assert art_acc == 0

def test_calc_exec_art_mixed():
    items = [
        FakeAssessment(8.0, 8.0, type="EXECUTION"),
        FakeAssessment(7.0, 7.0, type="ARTISTIC"),
        FakeAssessment(9.5, 8.0, type="EXECUTION"),
    ]
    exec_acc, art_acc = calc_exec_art_accuracy(items)
    assert exec_acc == 50.0
    assert art_acc == 100.0
