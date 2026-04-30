from dataclasses import dataclass
from app.services.bias import calc_bias

@dataclass
class FakeAssessment:
    referee_assessment: float
    result_type_assessment: float

@dataclass
class FakePerformance:
    competition_type: str
    region: str
    city: str

def test_bias_no_own_returns_zero():
    a = FakeAssessment(8.0, 8.0)
    p = FakePerformance("RUSSIA", "Тюмень", "Тюмень")
    assert calc_bias("Москва", "Москва", [(a, p)]) == 0.0

def test_bias_no_others_returns_zero():
    a = FakeAssessment(8.0, 8.0)
    p = FakePerformance("RUSSIA", "Москва", "Москва")
    assert calc_bias("Москва", "Москва", [(a, p)]) == 0.0

def test_bias_softer_to_own():
    own_a = FakeAssessment(8.5, 8.0)
    own_p = FakePerformance("RUSSIA", "Москва", "Москва")
    other_a = FakeAssessment(8.0, 8.0)
    other_p = FakePerformance("RUSSIA", "Тюмень", "Тюмень")

    result = calc_bias("Москва", "Москва", [(own_a, own_p), (other_a, other_p)])
    assert result == -0.5

def test_bias_stricter_to_own():
    own_a = FakeAssessment(7.5, 8.0)
    own_p = FakePerformance("RUSSIA", "Москва", "Москва")
    other_a = FakeAssessment(8.0, 8.0)
    other_p = FakePerformance("RUSSIA", "Тюмень", "Тюмень")

    result = calc_bias("Москва", "Москва", [(own_a, own_p), (other_a, other_p)])
    assert result == 0.5

def test_bias_uses_city_for_region_competition():
    own_a = FakeAssessment(8.5, 8.0)
    own_p = FakePerformance("REGION", "Любая", "Москва")
    other_a = FakeAssessment(8.0, 8.0)
    other_p = FakePerformance("REGION", "Любая", "Тюмень")

    result = calc_bias("Москва", "Москва", [(own_a, own_p), (other_a, other_p)])
    assert result == -0.5
