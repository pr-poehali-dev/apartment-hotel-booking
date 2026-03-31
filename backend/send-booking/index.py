import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def handler(event: dict, context) -> dict:
    """Отправляет заявку на бронирование на почту orangeapart@mail.ru"""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': ''
        }

    body = json.loads(event.get('body') or '{}')

    name = body.get('name', '').strip()
    phone = body.get('phone', '').strip()
    email = body.get('email', '').strip()
    comment = body.get('comment', '').strip()
    room = body.get('room', '').strip()
    check_in = body.get('checkIn', '').strip()
    check_out = body.get('checkOut', '').strip()
    nights = body.get('nights', '')
    guests = body.get('guests', '')
    total = body.get('total', '')

    if not name or not phone:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': '\u0418\u043c\u044f \u0438 \u0442\u0435\u043b\u0435\u0444\u043e\u043d \u043e\u0431\u044f\u0437\u0430\u0442\u0435\u043b\u044c\u043d\u044b'}, ensure_ascii=False)
        }

    smtp_user = 'orangeapart@mail.ru'
    smtp_password = os.environ['SMTP_PASSWORD']

    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f0f0f; color: #f0f0f0; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #c9a84c, #e8c96d); padding: 24px 32px;">
        <h1 style="margin: 0; font-size: 22px; color: #000; letter-spacing: 2px;">AURA APART</h1>
        <p style="margin: 4px 0 0; color: #000; opacity: 0.7; font-size: 13px;">Новая заявка на бронирование</p>
      </div>
      <div style="padding: 32px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #999; font-size: 13px; width: 140px;">Гость</td><td style="padding: 8px 0; font-size: 15px; font-weight: bold; color: #fff;">{name}</td></tr>
          <tr><td style="padding: 8px 0; color: #999; font-size: 13px;">Телефон</td><td style="padding: 8px 0; font-size: 15px; color: #c9a84c;">{phone}</td></tr>
          {'<tr><td style="padding: 8px 0; color: #999; font-size: 13px;">Email</td><td style="padding: 8px 0; font-size: 15px; color: #fff;">' + email + '</td></tr>' if email else ''}
          {'<tr><td style="padding: 8px 0; color: #999; font-size: 13px;">Номер</td><td style="padding: 8px 0; font-size: 15px; color: #fff;">' + room + '</td></tr>' if room else ''}
          {'<tr><td style="padding: 8px 0; color: #999; font-size: 13px;">Заезд</td><td style="padding: 8px 0; font-size: 15px; color: #fff;">' + check_in + '</td></tr>' if check_in else ''}
          {'<tr><td style="padding: 8px 0; color: #999; font-size: 13px;">Выезд</td><td style="padding: 8px 0; font-size: 15px; color: #fff;">' + check_out + '</td></tr>' if check_out else ''}
          {'<tr><td style="padding: 8px 0; color: #999; font-size: 13px;">Ночей</td><td style="padding: 8px 0; font-size: 15px; color: #fff;">' + str(nights) + '</td></tr>' if nights else ''}
          {'<tr><td style="padding: 8px 0; color: #999; font-size: 13px;">Гостей</td><td style="padding: 8px 0; font-size: 15px; color: #fff;">' + str(guests) + '</td></tr>' if guests else ''}
          {'<tr><td style="padding: 8px 0; color: #999; font-size: 13px;">Итого</td><td style="padding: 8px 0; font-size: 18px; font-weight: bold; color: #c9a84c;">' + str(total) + ' ₽</td></tr>' if total else ''}
          {'<tr><td style="padding: 8px 0; color: #999; font-size: 13px; vertical-align: top;">Пожелания</td><td style="padding: 8px 0; font-size: 14px; color: #ccc;">' + comment + '</td></tr>' if comment else ''}
        </table>
      </div>
      <div style="padding: 16px 32px; border-top: 1px solid #222; font-size: 12px; color: #555;">
        Заявка отправлена с сайта AURA APART · Сочи, ул. Навагинская 11Б
      </div>
    </div>
    """

    msg = MIMEMultipart('alternative')
    msg['Subject'] = f'Новая заявка: {name} — {room or "номер не выбран"}'
    msg['From'] = smtp_user
    msg['To'] = smtp_user
    msg.attach(MIMEText(html, 'html', 'utf-8'))

    with smtplib.SMTP_SSL('smtp.mail.ru', 465) as server:
        server.login(smtp_user, smtp_password)
        server.sendmail(smtp_user, smtp_user, msg.as_string())

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True})
    }