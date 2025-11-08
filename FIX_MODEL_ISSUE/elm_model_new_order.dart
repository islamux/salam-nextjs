import 'dart:convert';
import 'package:elm/core/data/model/enum_order.dart';

class ElmModelNewOrder {
  final List<String>? titles;

  final List<String>? subtitles;

  final List<String>? texts;

  final List<String>? ayahs;

  final String? footer;

  final List<EnOrder> order;

  ElmModelNewOrder({
    this.titles,
    this.subtitles,
    this.texts,
    this.ayahs,
    this.footer,
    required this.order,
  });

  factory ElmModelNewOrder.fromJson(Map<String, dynamic> json) {
    return ElmModelNewOrder(
      titles: (json['titles'] as List?)?.cast<String>(),
      subtitles: (json['subtitles'] as List?)?.cast<String>(),
      texts: (json['texts'] as List?)?.cast<String>(),
      ayahs: (json['ayahs'] as List?)?.cast<String>(),
      footer: json['footer'] as String?,
      order: (json['order'] as List<dynamic>)
          .map((e) => EnOrder.values.firstWhere(
                (element) => element.toString().split('.').last == e,
                orElse: () => throw FormatException(
                  'Invalid EnOrder value: $e. Valid values are: titles, subtitles, texts, ayahs, footer',
                ),
              ))
          .toList(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      if (titles != null) 'titles': titles,
      if (subtitles != null) 'subtitles': subtitles,
      if (texts != null) 'texts': texts,
      if (ayahs != null) 'ayahs': ayahs,
      if (footer != null) 'footer': footer,
      'order': order.map((e) => e.toString().split('.').last).toList(),
    };
  }

  ElmModelNewOrder copyWith({
    List<String>? titles,
    List<String>? subtitles,
    List<String>? texts,
    List<String>? ayahs,
    String? footer,
    List<EnOrder>? order,
  }) {
    return ElmModelNewOrder(
      titles: titles ?? this.titles,
      subtitles: subtitles ?? this.subtitles,
      texts: texts ?? this.texts,
      ayahs: ayahs ?? this.ayahs,
      footer: footer ?? this.footer,
      order: order ?? this.order,
    );
  }

  @override
  String toString() {
    return 'ElmModelNewOrder(titles: $titles, subtitles: $subtitles, texts: $texts, ayahs: $ayahs, footer: $footer, order: $order)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is ElmModelNewOrder &&
        other.titles == titles &&
        other.subtitles == subtitles &&
        other.texts == texts &&
        other.ayahs == ayahs &&
        other.footer == footer &&
        other.order == order;
  }

  @override
  int get hashCode {
    return Object.hash(titles, subtitles, texts, ayahs, footer, order);
  }
}

extension ElmModelNewOrderJson on ElmModelNewOrder {
  String toJsonString() => json.encode(toJson());
}

class ElmModelNewOrderHelpers {
  static ElmModelNewOrder fromJsonString(String jsonString) {
    return ElmModelNewOrder.fromJson(json.decode(jsonString));
  }
}
