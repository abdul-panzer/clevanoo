<?php

namespace App\Support;

use App\Models\Job;

final class JobListing
{
    public const CATEGORY_PATTERNS = [
        'accounting-finance' => '/\b(?:account(?:ant|ants|ing)|accounts (?:payable|receivable)|audit(?:or|ing)?|bookkeep(?:er|ing)|controller|finance|financial|bank(?:er|ing)|tax|treasury|payroll|underwrit(?:er|ing)|billing specialist)\b/i',
        'technology' => '/\b(?:software|developer|programmer|technology|IT|ITSM|cloud|cybersecurity|DevOps|QA|SDET|data|Snowflake|Databricks|ETL|SQL|database|network|systems?|technical|infrastructure|SAP|Workday|ServiceNow|salesforce|mainframe|full[- ]stack|web|AI|machine learning|scrum|SRE|BI|information security|security engineer|application support)\b/i',
        'telecommunications' => '/\b(?:telecom(?:munications?)?|fiber|fibre|OSP|wireless|RF engineer|radio frequency|broadband|VoIP|CCaaS|5G|unified communications|network engineer|network technician|network operations|NOC engineer)\b/i',
        'healthcare' => '/\b(?:health[ -]?care|medical|clinical|nurs(?:e|es|ing)|RN|LPN|CNA|allied health|therap(?:y|ist)|PTA?|OT|rehab(?:ilitation)?|pharmac(?:y|ist|eutical)|physician|patient|radiolog(?:y|ist)|sonograph(?:er|y)|respiratory|Epic (?:analyst|system)|health informatics|care coordinator)\b/i',
    ];

    public static function location(Job $job): string
    {
        $city = trim((string) $job->city);
        $state = trim((string) $job->state);
        if (strcasecmp($city, 'Remote') === 0 && in_array(strtoupper($state), ['REMOTE', 'US', 'USA', 'UNITED STATES'], true)) {
            return 'Remote';
        }

        return implode(', ', array_filter([$city, strcasecmp($state, $city) === 0 ? '' : $state]));
    }

    public static function facts(Job $job): array
    {
        $term = trim((string) $job->duration);
        $type = preg_match('/^(?:full[ -]?time|part[ -]?time|permanent|temporary|contract(?:[ -]to[ -]hire)?|internship)$/i', $term);

        return array_filter(['Location' => self::location($job), ($type ? 'Employment type' : 'Duration') => $term]);
    }

    public static function sections(Job $job): array
    {
        $description = trim((string) $job->description);
        if (! preg_match('/[\pL\pN]/u', $description)) {
            return [];
        }

        $sections = [];
        $heading = 'Overview';
        foreach (preg_split('/\R/u', $description) as $line) {
            if (preg_match('/^\s*(?:[-*]\s*)?(responsibilities|duties|requirements|qualifications|required skills(?:\s*(?:&|and|\/)\s*experience)?|preferred qualifications|location|employment type|job type|work arrangement|pay range)\s*:\s*(.*)$/i', $line, $matches)) {
                $name = strtolower($matches[1]);
                $heading = match (true) {
                    $name === 'duties' => 'Responsibilities',
                    str_starts_with($name, 'required skills'), $name === 'qualifications' => 'Requirements',
                    $name === 'job type' => 'Employment type',
                    default => ucfirst($name),
                };
                $line = $matches[2];
            }
            $sections[$heading][] = $line;
        }

        // Older Snowflake listings use a task list and stack names without section headings.
        if (count($sections) === 1 && preg_match('/^Developing in Snowflake\/AWS\b/im', $description)
            && preg_match('/^Snowflake native tools\b/im', $description)) {
            $sections = [];
            foreach (preg_split('/\R/u', $description, -1, PREG_SPLIT_NO_EMPTY) as $line) {
                $heading = match (true) {
                    (bool) preg_match('/^\s*W[\s-]?2 only\s*$/i', $line) => 'Work arrangement',
                    (bool) preg_match('/^\s*(?:Developing in|Land all data)\b/i', $line) => 'Responsibilities',
                    default => 'Tools and technologies',
                };
                $sections[$heading][] = $line;
            }
        }

        return array_filter(array_map(static fn (array $lines): string => trim(implode("\n", $lines)), $sections));
    }
}
