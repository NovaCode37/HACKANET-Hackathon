def calc_bias(
    referee_region: str,
    referee_city: str,
    assessments_with_perfomances: list,  
) -> float:
    own_deviations = []      
    others_deviations = []   

    for assessment, perfomance in assessments_with_perfomances:
        deviation = assessment.referee_assessment - assessment.result_type_assessment

        if perfomance.competition_type == "RUSSIA":
            is_own = perfomance.region == referee_region
        else:
            is_own = perfomance.city == referee_city

        if is_own:
            own_deviations.append(deviation)
        else:
            others_deviations.append(deviation)

 
    if len(own_deviations) == 0 or len(others_deviations) == 0:
        return 0.0

    mean_own = sum(own_deviations) / len(own_deviations)
    mean_others = sum(others_deviations) / len(others_deviations)

    return mean_others - mean_own



