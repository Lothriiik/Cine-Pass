package store

import "github.com/StartLivin/screek/backend/internal/movies"

func MovieToDomain(r *MovieRecord) *movies.Movie {
	if r == nil {
		return nil
	}
	var genres []movies.Genre
	for _, g := range r.Genres {
		genres = append(genres, *GenreToDomain(&g))
	}
	var credits []movies.MovieCredit
	for _, c := range r.Credits {
		credits = append(credits, *CreditToDomain(&c))
	}

	return &movies.Movie{
		ID:               r.ID,
		TMDBID:           r.TMDBID,
		Title:            r.Title,
		Overview:         r.Overview,
		PosterURL:        r.PosterURL,
		BackdropURL:      r.BackdropURL,
		UpdatedAt:        r.UpdatedAt,
		ReleaseDate:      r.ReleaseDate,
		Status:           r.Status,
		Runtime:          r.Runtime,
		OriginalLanguage: r.OriginalLanguage,
		SpokenLanguages:  r.SpokenLanguages,
		Genres:           genres,
		Credits:          credits,
	}
}

func MovieToRecord(d *movies.Movie) *MovieRecord {
	if d == nil {
		return nil
	}
	var genres []GenreRecord
	for _, g := range d.Genres {
		genres = append(genres, *GenreToRecord(&g))
	}
	var credits []MovieCreditRecord
	for _, c := range d.Credits {
		credits = append(credits, *CreditToRecord(&c))
	}

	return &MovieRecord{
		ID:               d.ID,
		TMDBID:           d.TMDBID,
		Title:            d.Title,
		Overview:         d.Overview,
		PosterURL:        d.PosterURL,
		BackdropURL:      d.BackdropURL,
		UpdatedAt:        d.UpdatedAt,
		ReleaseDate:      d.ReleaseDate,
		Status:           d.Status,
		Runtime:          d.Runtime,
		OriginalLanguage: d.OriginalLanguage,
		SpokenLanguages:  d.SpokenLanguages,
		Genres:           genres,
		Credits:          credits,
	}
}

func GenreToDomain(r *GenreRecord) *movies.Genre {
	if r == nil {
		return nil
	}
	return &movies.Genre{
		ID:     r.ID,
		TMDBID: r.TMDBID,
		Name:   r.Name,
	}
}

func GenreToRecord(d *movies.Genre) *GenreRecord {
	if d == nil {
		return nil
	}
	return &GenreRecord{
		ID:     d.ID,
		TMDBID: d.TMDBID,
		Name:   d.Name,
	}
}

func PersonToDomain(r *PersonRecord) *movies.Person {
	if r == nil {
		return nil
	}
	return &movies.Person{
		ID:         r.ID,
		TMDBID:     r.TMDBID,
		Name:       r.Name,
		ProfileURL: r.ProfileURL,
	}
}

func PersonToRecord(d *movies.Person) *PersonRecord {
	if d == nil {
		return nil
	}
	return &PersonRecord{
		ID:         d.ID,
		TMDBID:     d.TMDBID,
		Name:       d.Name,
		ProfileURL: d.ProfileURL,
	}
}

func CreditToDomain(r *MovieCreditRecord) *movies.MovieCredit {
	if r == nil {
		return nil
	}
	var person movies.Person
	if r.Person.ID != 0 || r.Person.Name != "" {
		person = *PersonToDomain(&r.Person)
	}

	return &movies.MovieCredit{
		ID:        r.ID,
		MovieID:   r.MovieID,
		PersonID:  r.PersonID,
		Role:      r.Role,
		Character: r.Character,
		Person:    person,
	}
}

func CreditToRecord(d *movies.MovieCredit) *MovieCreditRecord {
	if d == nil {
		return nil
	}
	var person PersonRecord
	if d.Person.ID != 0 || d.Person.Name != "" {
		person = *PersonToRecord(&d.Person)
	}

	return &MovieCreditRecord{
		ID:        d.ID,
		MovieID:   d.MovieID,
		PersonID:  d.PersonID,
		Role:      d.Role,
		Character: d.Character,
		Person:    person,
	}
}
