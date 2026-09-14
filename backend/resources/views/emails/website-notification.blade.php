<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>{{ $subjectLine }}</title>
</head>
<body style="margin:0;padding:0;background:#f4f7fb;color:#1f2937;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f7fb;padding:24px 0;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
                    <tr>
                        <td style="padding:24px 28px;background:#0f4c81;color:#ffffff;">
                            <h1 style="margin:0;font-size:22px;line-height:1.3;">{{ $payload['title'] }}</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:24px 28px;">
                            <p style="margin:0 0 18px;font-size:15px;line-height:1.5;">
                                A new {{ str_replace('_', ' ', $type) }} was submitted from the Clevanoo website.
                            </p>

                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                                @foreach ($payload['fields'] as $field)
                                    <tr>
                                        <td style="padding:12px;border-top:1px solid #e5e7eb;width:190px;font-weight:bold;vertical-align:top;">
                                            {{ $field['label'] }}
                                        </td>
                                        <td style="padding:12px;border-top:1px solid #e5e7eb;vertical-align:top;white-space:pre-wrap;">
                                            @if ($field['is_url'])
                                                <a href="{{ $field['value'] }}" style="color:#0f4c81;">{{ $field['value'] }}</a>
                                            @else
                                                {{ $field['value'] }}
                                            @endif
                                        </td>
                                    </tr>
                                @endforeach
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
