from homework10.task1 import (
    get_companies_data,
    get_companies_pages,
    top_ten_high_year_growth,
    top_ten_low_p_e,
    top_ten_most_expensive_stocks,
    top_ten_potential_profit,
)

list_of_companies_pages = [
    [
        "Xcel Energy Inc.",
        "https://markets.businessinsider.comhttps://markets.businessinsider.com/stocks/xel-stock",
        4.73,
    ],
    [
        "Xerox",
        "https://markets.businessinsider.comhttps://markets.businessinsider.com/stocks/xrx-stock",
        15.77,
    ],
    [
        "Xilinx Inc.",
        "https://markets.businessinsider.comhttps://markets.businessinsider.com/stocks/xlnx-stock",
        21.68,
    ],
    [
        "Xylem Inc.",
        "https://markets.businessinsider.comhttps://markets.businessinsider.com/stocks/xyl-stock",
        58.46,
    ],
]

companies_data_dict = {
    "3M Co. ": {
        "company_code": "MMM",
        "market_cap": 117.95,
        "current_value": 202.15,
        "p_e_ratio": 19.91,
        "week_low_52": 148.8,
        "week_high_52": 208.95,
        "year_change": 22.04,
    },
    "A.O. Smith Corp. ": {
        "company_code": "AOS",
        "market_cap": 10.97,
        "current_value": 68.44,
        "p_e_ratio": 25.06,
        "week_low_52": 43.88,
        "week_high_52": 73.05,
        "year_change": 34.27,
    },
    "Alaska Air Group Inc. ": {
        "company_code": "ALK",
        "market_cap": 8.25,
        "current_value": 65.65,
        "p_e_ratio": -5.1,
        "week_low_52": 33.0,
        "week_high_52": 74.25,
        "year_change": 30.5,
    },
    "Albemarle Corp. ": {
        "company_code": "ALB",
        "market_cap": 20.53,
        "current_value": 174.0,
        "p_e_ratio": 35.35,
        "week_low_52": 72.39,
        "week_high_52": 188.3,
        "year_change": 96.82,
    },
    "Allegion PLC ": {
        "company_code": "ALLE",
        "market_cap": 12.5,
        "current_value": 138.09,
        "p_e_ratio": None,
        "week_low_52": 94.01,
        "week_high_52": 144.73,
        "year_change": 19.57,
    },
    "Alliant Energy Corp. ": {
        "company_code": "LNT",
        "market_cap": 14.4,
        "current_value": 58.3,
        "p_e_ratio": 20.65,
        "week_low_52": 45.99,
        "week_high_52": 58.53,
        "year_change": 11.05,
    },
    "Allstate Corp. ": {
        "company_code": "ALL",
        "market_cap": 40.26,
        "current_value": 133.2,
        "p_e_ratio": 7.27,
        "week_low_52": 84.97,
        "week_high_52": 140.0,
        "year_change": 25.84,
    },
    "Alphabet A (ex Google) ": {
        "company_code": "GOOGL",
        "market_cap": 1606.43,
        "current_value": 2406.02,
        "p_e_ratio": 30.0,
        "week_low_52": 1351.65,
        "week_high_52": 2431.38,
        "year_change": 65.9,
    },
    "Amazon ": {
        "company_code": "AMZN",
        "market_cap": 1645.22,
        "current_value": 3278.0,
        "p_e_ratio": 79.54,
        "week_low_52": 2503.35,
        "week_high_52": 3553.39,
        "year_change": 26.7,
    },
    "AMD (Advanced Micro Devices)  Inc. ": {
        "company_code": "AMD",
        "market_cap": 98.23,
        "current_value": 79.93,
        "p_e_ratio": 70.19,
        "week_low_52": 48.42,
        "week_high_52": 99.23,
        "year_change": 53.58,
    },
    "Ameren Corp. ": {
        "company_code": "AEE",
        "market_cap": 21.65,
        "current_value": 85.36,
        "p_e_ratio": 21.68,
        "week_low_52": 67.14,
        "week_high_52": 86.87,
        "year_change": 11.59,
    },
    "American Airlines Inc ": {
        "company_code": "AAL",
        "market_cap": 15.53,
        "current_value": 24.03,
        "p_e_ratio": -0.81,
        "week_low_52": 10.63,
        "week_high_52": 26.09,
        "year_change": 19.4,
    },
    "American Electric Power Co. Inc. ": {
        "company_code": "AEP",
        "market_cap": 41.44,
        "current_value": 84.45,
        "p_e_ratio": 18.17,
        "week_low_52": None,
        "week_high_52": None,
        "year_change": -5.79,
    },
}


def test_get_companies_pages():
    with open("tests/homework10/SnP500Stock.htm") as f:
        assert get_companies_pages(f.read()) == list_of_companies_pages


def test_get_companies_data():
    with open("tests/homework10/GRMNStock.htm") as f:
        assert get_companies_data(f.read()) == {
            "company_code": "GRMN",
            "company_name": "Garmin Ltd.",
            "market_cap": 27.37,
            "current_value": 142.17,
            "p_e_ratio": None,
            "week_low_52": 90.13,
            "week_high_52": 145.2,
        }


def test_top_ten_most_expensive_stocks():
    assert top_ten_most_expensive_stocks(companies_data_dict) == [
        {"code": "AMZN", "name": "Amazon ", "price": "236287.75"},
        {"code": "GOOGL", "name": "Alphabet A (ex Google) ", "price": "173432.90"},
        {"code": "MMM", "name": "3M Co. ", "price": "14571.56"},
        {"code": "ALB", "name": "Albemarle Corp. ", "price": "12542.42"},
        {"code": "ALLE", "name": "Allegion PLC ", "price": "9953.93"},
        {"code": "ALL", "name": "Allstate Corp. ", "price": "9601.44"},
        {"code": "AEE", "name": "Ameren Corp. ", "price": "6153.00"},
        {
            "code": "AEP",
            "name": "American Electric Power Co. Inc. ",
            "price": "6087.40",
        },
        {
            "code": "AMD",
            "name": "AMD (Advanced Micro Devices)  Inc. ",
            "price": "5761.59",
        },
        {"code": "AOS", "name": "A.O. Smith Corp. ", "price": "4933.35"},
    ]


def test_top_ten_low_p_e():
    assert top_ten_low_p_e(companies_data_dict) == [
        {"code": "ALK", "name": "Alaska Air Group Inc. ", "P/E": -5.1},
        {"code": "AAL", "name": "American Airlines Inc ", "P/E": -0.81},
        {"code": "ALL", "name": "Allstate Corp. ", "P/E": 7.27},
        {"code": "AEP", "name": "American Electric Power Co. Inc. ", "P/E": 18.17},
        {"code": "MMM", "name": "3M Co. ", "P/E": 19.91},
        {"code": "LNT", "name": "Alliant Energy Corp. ", "P/E": 20.65},
        {"code": "AEE", "name": "Ameren Corp. ", "P/E": 21.68},
        {"code": "AOS", "name": "A.O. Smith Corp. ", "P/E": 25.06},
        {"code": "GOOGL", "name": "Alphabet A (ex Google) ", "P/E": 30.0},
        {"code": "ALB", "name": "Albemarle Corp. ", "P/E": 35.35},
    ]


def test_top_ten_high_year_growth():
    assert top_ten_high_year_growth(companies_data_dict) == [
        {"code": "ALB", "name": "Albemarle Corp. ", "growth": 96.82},
        {"code": "GOOGL", "name": "Alphabet A (ex Google) ", "growth": 65.9},
        {"code": "AMD", "name": "AMD (Advanced Micro Devices)  Inc. ", "growth": 53.58},
        {"code": "AOS", "name": "A.O. Smith Corp. ", "growth": 34.27},
        {"code": "ALK", "name": "Alaska Air Group Inc. ", "growth": 30.5},
        {"code": "AMZN", "name": "Amazon ", "growth": 26.7},
        {"code": "ALL", "name": "Allstate Corp. ", "growth": 25.84},
        {"code": "MMM", "name": "3M Co. ", "growth": 22.04},
        {"code": "ALLE", "name": "Allegion PLC ", "growth": 19.57},
        {"code": "AAL", "name": "American Airlines Inc ", "growth": 19.4},
    ]


def test_top_ten_potential_profit():
    assert top_ten_potential_profit(companies_data_dict) == [
        {
            "code": "GOOGL",
            "name": "Alphabet A (ex Google) ",
            "potential profit": "1079.73",
        },
        {"code": "AMZN", "name": "Amazon ", "potential profit": "1050.04"},
        {"code": "ALB", "name": "Albemarle Corp. ", "potential profit": "115.91"},
        {"code": "MMM", "name": "3M Co. ", "potential profit": "60.15"},
        {"code": "ALL", "name": "Allstate Corp. ", "potential profit": "55.03"},
        {
            "code": "AMD",
            "name": "AMD (Advanced Micro Devices)  Inc. ",
            "potential profit": "50.81",
        },
        {"code": "ALLE", "name": "Allegion PLC ", "potential profit": "50.72"},
        {"code": "ALK", "name": "Alaska Air Group Inc. ", "potential profit": "41.25"},
        {"code": "AOS", "name": "A.O. Smith Corp. ", "potential profit": "29.17"},
        {"code": "AEE", "name": "Ameren Corp. ", "potential profit": "19.73"},
    ]
