<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
    <title>{{ $subjectLine }}</title>
</head>
<body style="margin:0;padding:0;background:#eef4f8;color:#1c2630;font-family:Arial,Helvetica,sans-serif;">
    @php
        $logoUrl = config('services.website_mail.logo_url', 'https://clevanoo.com/logo.webp');
        $brandUrl = config('services.website_mail.brand_url', 'https://clevanoo.com');
    @endphp

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#eef4f8;padding:34px 12px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;background:#ffffff;border:1px solid #dfe8ee;border-radius:10px;overflow:hidden;">
                    <tr>
                        <td style="padding:0;background:#ffffff;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td align="center" style="padding:30px 34px 16px;border-bottom:1px solid #edf2f5;">
                                        <a href="{{ $brandUrl }}" style="text-decoration:none;">
                                            <img src="{{ $logoUrl }}" alt="Clevanoo" width="148" style="display:block;width:148px;max-width:148px;height:auto;border:0;">
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding:34px 46px 22px;">
                                        <div style="display:inline-block;border:1px solid #1c2630;padding:10px 24px;color:#1c2630;font-size:13px;line-height:1;font-weight:700;">
                                            {{ $payload['title'] }}
                                        </div>
                                        <h1 style="margin:22px 0 12px;color:#111827;font-size:32px;line-height:1.2;font-weight:700;letter-spacing:0;">
                                            Clevanoo LLC
                                        </h1>
                                        <p style="margin:0;color:#64717d;font-size:16px;line-height:1.65;">
                                            New {{ str_replace('_', ' ', $type) }} received from the Clevanoo website.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:8px 46px 24px;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border-top:1px solid #e6edf2;">
                                @foreach ($payload['fields'] as $field)
                                    <tr>
                                        <td style="padding:12px 0;border-bottom:1px solid #e6edf2;width:150px;vertical-align:middle;color:#111827;font-size:12px;line-height:1.4;font-weight:700;text-transform:uppercase;">{{ $field['label'] }}</td>
                                        <td style="padding:12px 0 12px 18px;border-bottom:1px solid #e6edf2;vertical-align:middle;color:#263442;font-size:15px;line-height:1.4;word-break:break-word;text-align:left;">@if ($field['is_url'])<a href="{{ trim($field['value']) }}" style="color:#087ca7;text-decoration:underline;">{{ strtolower($field['label']) === 'resume' ? 'Download resume' : trim($field['value']) }}</a>@else{{ trim($field['value']) }}@endif</td>
                                    </tr>
                                @endforeach
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:0 46px 38px;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top:4px solid #80E1FC;background:#2c3e50;">
                                <tr>
                                    <td style="padding:22px 24px;color:#ffffff;font-size:14px;line-height:1.75;">
                                        <strong style="color:#ffffff;font-size:16px;">Clevanoo LLC</strong><br>
                                        <a href="https://www.google.com/maps/search/?api=1&query=Suite%20262%2C%2012800%20Westridge%20Blvd%2C%20Frisco%2C%20TX%2075035" target="_blank" style="color:#d8e8ef !important;text-decoration:none !important;border-bottom:0 !important;display:inline;">Suite 262, 12800 Westridge Blvd, Frisco, TX 75035</a><br>
                                        <a href="mailto:info@clevanoo.com" style="color:#80E1FC !important;text-decoration:none !important;border-bottom:0 !important;display:inline;">info@clevanoo.com</a>
                                        <span style="color:#80E1FC;"> | </span>
                                        <a href="tel:+19495704008" target="_blank" style="color:#80E1FC !important;text-decoration:none !important;border-bottom:0 !important;display:inline;">(949) 570-4008</a>
                                        <span style="color:#80E1FC;"> | </span>
                                        <a href="{{ $brandUrl }}" style="color:#80E1FC !important;text-decoration:none !important;border-bottom:0 !important;display:inline;">clevanoo.com</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>



