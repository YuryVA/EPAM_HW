import asyncio
import xml.etree.ElementTree
from concurrent.futures import ProcessPoolExecutor

import aiohttp
import requests
from bs4 import BeautifulSoup


def get_htmls(url_list: list):
    """
    return list of htmls from list or urls
    """

    async def fetch_html(client, url: str):
        """
        fetch response from http's
        """

        async with client.get(url) as resp:
            return await resp.text()

    async def get_task(urls: list):
        """
        get html pages
        """

        async with aiohttp.ClientSession() as client:
            task = [asyncio.create_task(fetch_html(client, url)) for url in urls]
            await asyncio.gather(*task)

        return task

    loop = asyncio.get_event_loop()
    htmls = loop.run_until_complete(get_task(url_list))

    return htmls


def get_companies_pages(html):
    """
    create list - [
                   company name,
                   company page link,
                   company year price change in %
                   ]
    """
    links = []
    soup = BeautifulSoup(html, features="html.parser")
    for company_name in soup.tbody:
        try:
            company_page_link = f'https://markets.businessinsider.com{company_name.find("a").get("href")}'
            company_year_change = company_name.get_text(
                separator=" ", strip=True
            ).split()[-1]

            links.append(
                [
                    company_name.find("a").get("title"),
                    company_page_link,
                    float(company_year_change.rstrip("%")),
                ]
            )
        except AttributeError:
            pass
    return links


def get_companies_data(html):
    """
    create dictionary with company data {
                                        company_code: company code,
                                        market_cap: market capitalization,
                                        current_value: current value,
                                        p_e_ratio: p/e ratio,
                                        week_low_52: 52 week low,
                                        week_high_52: 52 week high
                                        }"
    """

    soup = BeautifulSoup(html, features="html.parser")

    company_code = soup.title.get_text(separator=" ", strip=True).split()[0]
    company_name = soup.find("span", class_="price-section__label").get_text()

    current_value = soup.find("span", class_="price-section__current-value").get_text()
    current_value = float(current_value.replace(",", ""))

    div = soup.find("div", id="lgPositionsnapshot")
    stock_snapshot = div.find_next().get_text(separator=" ", strip=True).split()
    try:
        market_cap = stock_snapshot[stock_snapshot.index("Market") - 2]
    except ValueError:
        market_cap = None
    if market_cap:
        market_cap = float(market_cap.replace(",", ""))
    try:
        p_e_ratio = stock_snapshot[stock_snapshot.index("P/E") - 1]
    except ValueError:
        p_e_ratio = None
    if p_e_ratio:
        p_e_ratio = float(p_e_ratio.replace(",", ""))
    try:
        week_low_52 = stock_snapshot[stock_snapshot.index("52") - 1]
    except ValueError:
        week_low_52 = None
    if week_low_52:
        week_low_52 = float(week_low_52.replace(",", ""))
    try:
        week_high_52 = stock_snapshot[stock_snapshot.index("52") + 3]
    except ValueError:
        week_high_52 = None
    if week_high_52:
        week_high_52 = float(week_high_52.replace(",", ""))

    company_data = {
        "company_code": company_code,
        "company_name": company_name,
        "market_cap": market_cap,
        "current_value": current_value,
        "p_e_ratio": p_e_ratio,
        "week_low_52": week_low_52,
        "week_high_52": week_high_52,
    }

    return company_data


def main(url: str):
    """
    create dictionary with companies data - {
                                            company name:
                                                            {
                                                            company_code: company code,
                                                            market_cap: market capitalization,
                                                            current_value: current value,
                                                            p_e_ratio: p/e ratio,
                                                            week_low_52: 52 week low,
                                                            week_high_52: 52 week high
                                                            year_change: company year price change in %
                                                            }
                                            }
    """

    companies_pages_list = []
    companies_pages_data = {}

    url_list = [f"{url}?p={i}" for i in range(1, 12)]

    ayo_html_pages = get_htmls(url_list)
    html_pages = [html.result() for html in ayo_html_pages]

    if __name__ == "__main__":
        with ProcessPoolExecutor() as pool:
            result = pool.map(get_companies_pages, html_pages)
            for res in result:
                companies_pages_list.extend(res)

    companies_year_change = [(i[0], i[2]) for i in companies_pages_list]
    companies_pages_urls_list = [i[1] for i in companies_pages_list]

    ayo_html_comp = get_htmls(companies_pages_urls_list)
    html_comp = [html.result() for html in ayo_html_comp]

    if __name__ == "__main__":
        with ProcessPoolExecutor() as pool:
            for pair, data_dict in zip(
                companies_year_change, pool.map(get_companies_data, html_comp)
            ):
                company_name = data_dict.pop("company_name")
                companies_pages_data[company_name] = data_dict
                companies_pages_data[company_name]["year_change"] = pair[1]

    return companies_pages_data


def get_conversion_course_usd_rub():
    """
    get realtime conversion course from usd to rub
    """

    link = "http://www.cbr.ru/scripts/XML_daily.asp"

    with requests.Session() as session:
        response = session.get(link)
        tree = xml.etree.ElementTree.fromstring(response.text)

        for entry in tree.findall("Valute"):
            if entry.attrib["ID"] == "R01235":
                for child in entry:
                    if child.tag == "Value":
                        conversion_course = child.text

    return float(conversion_course.replace(",", "."))


def top_ten_most_expensive_stocks(data_dict: dict):
    """
    create JSON with top 10 most expensive companies
    """

    most_exp_stocks_json = []

    most_exp_stocks = sorted(
        data_dict.items(), key=lambda x: x[1]["current_value"], reverse=True
    )[:10]
    for key, value in most_exp_stocks:
        most_exp_stocks_json.append(
            {
                "code": value["company_code"],
                "name": key,
                "price": f"{value['current_value'] * get_conversion_course_usd_rub():.2f}",
            }
        )
    return most_exp_stocks_json


def top_ten_low_p_e(data_dict: dict):
    """
    create JSON with top 10 companies with lowest p/e ratio
    """

    low_p_e_json = []
    data_dict_drop_none = {}

    for key, value in data_dict.items():
        if value["p_e_ratio"]:
            data_dict_drop_none[key] = value

    low_p_e = sorted(data_dict_drop_none.items(), key=lambda x: x[1]["p_e_ratio"])[:10]
    for key, value in low_p_e:
        low_p_e_json.append(
            {"code": value["company_code"], "name": key, "P/E": value["p_e_ratio"]}
        )
    return low_p_e_json


def top_ten_high_year_growth(data_dict: dict):
    """
    create JSON with top 10 companies with highest last year growth
    """

    high_year_json = []

    high_year = sorted(
        data_dict.items(), key=lambda x: x[1]["year_change"], reverse=True
    )[:10]
    for key, value in high_year:
        high_year_json.append(
            {
                "code": value["company_code"],
                "name": key,
                "growth": value["year_change"],
            }
        )
    return high_year_json


def top_ten_potential_profit(data_dict: dict, n=1):
    """
    create JSON with top 10 companies with potential profit for the last year
    :param n: number of stocks
    :param data_dict: dictionary with data
    """

    profit_json = []
    profit_dict = {}

    for key, value in data_dict.items():
        if value["week_low_52"] and value["week_high_52"]:
            profit_dict[key] = value["week_high_52"] - value["week_low_52"]

    profit = sorted(profit_dict.items(), key=lambda x: x[1], reverse=True)[:10]
    for key, value in profit:
        profit_json.append(
            {
                "code": data_dict[key]["company_code"],
                "name": key,
                "potential profit": f"{value * n:.2f}",
            }
        )
    return profit_json


if __name__ == "__main__":
    data = main("https://markets.businessinsider.com/index/components/s&p_500")
    print(top_ten_most_expensive_stocks(data))
    print(top_ten_low_p_e(data))
    print(top_ten_high_year_growth(data))
    print(top_ten_potential_profit(data))
